import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async create(input: CreateUserInput): Promise<User> {
        const hashed = await bcrypt.hash(input.password, 10);
        const created = new this.userModel({ ...input, password: hashed });
        return created.save();
    }

    async validateUser(email: string, pass: string): Promise<(UserDocument & { _id: string }) | null> {
        const user = await this.userModel.findOne({ email }).exec();
        if (user && await bcrypt.compare(pass, user.password)) {
            return user as UserDocument & { _id: string }; // tell TS: user._id exists
        }
        return null;
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return user;
    }

    async update(updateUserInput: UpdateUserInput): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            updateUserInput.id,
            updateUserInput,
            { new: true },
        ).exec();

        if (!updatedUser) {
            throw new NotFoundException(`User with id ${updateUserInput.id} not found`);
        }

        return updatedUser;
    }

    async remove(id: string): Promise<User> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
        return deletedUser;
    }
}
