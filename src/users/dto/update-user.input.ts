import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field()
  id: string;
  
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  profilePic?: string;   

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  occupation?: string;

  @Field({ nullable: true })
  birthDate?: Date;

}