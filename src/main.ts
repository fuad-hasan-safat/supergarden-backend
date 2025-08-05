import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const connection = app.get<Connection>(getConnectionToken());
  connection.once('open', () => {
    console.log('✅ MongoDB connected!');
  });
  connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000/graphql`);
}
bootstrap();
