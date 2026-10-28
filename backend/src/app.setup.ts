import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import helmet from 'helmet';
import { AllExceptionsFilter } from '@/exceptions/all-exceptions.filter';

export function configureApp(app: INestApplication) {
    app.useGlobalFilters(new AllExceptionsFilter())

    const corsOptions: CorsOptions = {
      origin: ['http://localhost:3001', 'https://vaultly.cash', 'http://localhost:3000'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Content-Type,Authorization'
    }
    app.enableCors(corsOptions)


    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      skipNullProperties: true,
      skipUndefinedProperties: false,
      forbidNonWhitelisted: false,
      transform: true,
      disableErrorMessages: true,
      validationError: {target: false, value: false},
      stopAtFirstError: true
    }))


    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          "default-src": ["'self'"],
          "connect-src": ["'self'", "https://*.supabase.co"],
        }
      }
    }))
}
