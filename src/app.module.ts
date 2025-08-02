import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/supergarden'),

    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),

    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
