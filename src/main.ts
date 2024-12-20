import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 8080;
  await app.listen(port);
  // 输出访问地址
  console.log(`应用已启动: http://localhost:${port}`);
}
bootstrap();
