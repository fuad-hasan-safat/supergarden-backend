// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './users.service';
import { UserResolver } from './users.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule
],
  providers: [UserService, UserResolver],
})
export class UserModule {}
