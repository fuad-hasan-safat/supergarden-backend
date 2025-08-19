import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  profilePic?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  occupation?: string;

  @Field({ nullable: true })
  birthDate?: Date;
}
