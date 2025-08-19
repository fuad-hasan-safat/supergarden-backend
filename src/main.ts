import * as cookieParser from 'cookie-parser';
import { graphqlUploadExpress } from "graphql-upload-ts";
import { AppModule } from './app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const connection = app.get<Connection>(getConnectionToken());
  connection.once('open', () => {
    console.log('✅ MongoDB connected!');
  });
  connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  app.use(cookieParser());

  app.enableCors({
    origin: "http://localhost:3001",
    credentials: true,
  });


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 5 }));

  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000/graphql`);
}
bootstrap();
