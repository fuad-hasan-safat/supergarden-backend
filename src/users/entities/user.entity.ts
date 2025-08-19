import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../user.schema';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class User {
  @Field(() => ID, { name: 'id' })
  _id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  isActive: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => UserRole)
  role: UserRole;

  @Field({ nullable: true })
  profilePic?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  occupation?: string;

  @Field({ nullable: true })
  birthDate?: Date;
}
