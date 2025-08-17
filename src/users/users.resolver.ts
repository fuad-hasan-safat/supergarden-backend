import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Response } from 'express';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guard/gql-auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { ApolloError } from 'apollo-server-express';
import { AuthPayload } from 'src/auth/dto/auth-payload';

@Resolver(() => User)
export class UserResolver {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    @Mutation(() => User)
    createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.userService.create(createUserInput);
    }

    @Mutation(() => AuthPayload)
    async signin(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context('res') res: Response,
    ) {
        console.log("SIGN IN CALLED")
        const user = await this.userService.validateUser(email, password);
        if (!user) throw new ApolloError('Invalid credentials', 'UNAUTHORIZED');

        const token = await this.authService.login(user);
        res.cookie('authToken', token.access_token, { httpOnly: true });

        return token;
    }


    @Mutation(() => User)
    updateUser(@Args('updateUserInput') input: UpdateUserInput) {
        return this.userService.update(input);
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
    @UseGuards(GqlAuthGuard)
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.userService.findOne(id);
    }
}