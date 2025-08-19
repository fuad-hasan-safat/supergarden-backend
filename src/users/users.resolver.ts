import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Response } from 'express';
import { User } from './entities/user.entity';
const bcrypt = require('bcrypt');
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ApolloError } from 'apollo-server-express';
import { AuthPayload } from 'src/auth/dto/auth-payload';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { extname, join } from 'path';
import { createWriteStream } from 'fs';
import { NotFoundException, UseGuards } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }


    @Mutation(() => User)
    async updateUserProfilePic(
        @Args("id") id: string,
        @Args({ name: "file", type: () => GraphQLUpload }) file: FileUpload,
    ): Promise<User> {
        const { createReadStream, filename, mimetype } = await file;

        if (!/^image\/(png|jpe?g|webp|gif)$/i.test(mimetype)) {
            throw new Error('Only image uploads are allowed');
        }

        const uniqueName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}${extname(filename)}`;
        const uploadPath = join(process.cwd(), 'uploads', uniqueName);

        await new Promise<void>((resolve, reject) => {
            createReadStream()
                .pipe(createWriteStream(uploadPath))
                .on('finish', () => resolve())
                .on('error', reject);
        });

        const publicUrl = `/uploads/${uniqueName}`;

        return this.userService.update({
            id,
            profilePic: publicUrl,
        });
    }

    @Mutation(() => User)
    async updateUser(@Args('updateUserInput') input: UpdateUserInput) {

        console.log("🟢 updateUserInput received:", input);

        const user = await this.userService.findOne(input.id);
        if (!user) throw new NotFoundException(`User with id ${input.id} not found`);

        return this.userService.update(input);
    }

    @Mutation(() => User)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput,
    ) {
        console.log("🚀 Received createUserInput ->", createUserInput);
        if (!createUserInput.password) {
            throw new Error("Password is required");
        }

        const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

        return this.userService.create({
            ...createUserInput,
            password: hashedPassword,
        });
    }



    @Mutation(() => AuthPayload)
    async signin(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context('res') res: Response,
    ) {
        console.log("SIGN IN CALLED");

        const user = await this.userService.validateUser(email, password);
        if (!user) throw new ApolloError('Invalid credentials', 'UNAUTHORIZED');

        const token = await this.authService.login(user);

        res.cookie('authToken', token.access_token, { httpOnly: true });

        return {
            access_token: token.access_token,
            user,
        };
    }


    @Mutation(() => User)
    @UseGuards(GqlAuthGuard, RolesGuard)
    @Roles('ADMIN')
    removeUser(@Args('id', { type: () => String }) id: string) {
        return this.userService.remove(id);
    }

    @Query(() => [User], { name: 'users' })
    @UseGuards(GqlAuthGuard)
    findAll() {
        return this.userService.findAll();
    }

    @Query(() => User, { name: 'user' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.userService.findOne(id);
    }
}