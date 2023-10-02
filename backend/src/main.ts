import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AllExceptionsFilter } from './exceptions-filter.filter'
import * as cookieParser from 'cookie-parser'

async function start() {
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule)
    // app.enableCors() //выключение cors
    app.useGlobalFilters(new AllExceptionsFilter())
    app.setGlobalPrefix('api')
    app.use(cookieParser())
    app.enableCors({
        credentials: true,
        origin: true,
    })

    const config = new DocumentBuilder()
        .setTitle('Телефонный справочник')
        .setDescription('Документация REST API')
        .setVersion('3.0.0')
        .addCookieAuth('авторизация по jwt', { type: 'apiKey', description: 'В документации авторизоваться не получится' })
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('/api/docs', app, document, {
        swaggerOptions: { defaultModelsExpandDepth: -1 },
    })

    await app.listen(PORT, () => {
        console.log(`Server working on PORT ${PORT}`)
    })
}

start()
