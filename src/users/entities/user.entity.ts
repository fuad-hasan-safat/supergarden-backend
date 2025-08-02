import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../user.schema';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@ObjectType()
export class User {
  @Field(() => ID)
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
}
