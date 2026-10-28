import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import type { IncomingMessage, ServerResponse } from 'http';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';

// Vercel reuses warm instances, so build the Nest app once and share it across requests
let handler: ((req: IncomingMessage, res: ServerResponse) => void) | null = null;

async function getHandler() {
  if (!handler) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter());
    configureApp(app);
    await app.init();
    handler = app.getHttpAdapter().getInstance();
  }
  return handler!;
}

export default async function (req: IncomingMessage, res: ServerResponse) {
  const server = await getHandler();
  server(req, res);
}
