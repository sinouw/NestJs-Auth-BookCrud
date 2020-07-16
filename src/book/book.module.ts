import { ConfigModule } from './../core/config/config.module';
import { Module } from '@nestjs/common';
import { BookSchema } from 'src/models/book.model';
import { MongooseModule } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
        ConfigModule
      ],
    providers: [BookService],
    controllers: [BookController],
})
export class BookModule {}
