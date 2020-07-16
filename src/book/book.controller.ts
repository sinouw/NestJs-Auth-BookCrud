import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Put, Delete, ValidationPipe, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from 'src/models/book.model';
import { MyAuthGuard } from 'src/auth/guard/auth.guard';
import { ConfigService } from 'src/core/config/config.service';
import { extname } from 'path';

@Controller('book')
export class BookController {
    constructor(private bookService: BookService,private configService : ConfigService) { }

    // Retrieve documents list
    @UseGuards(MyAuthGuard)
    @Get('getAllWithPermission')
    async getAlldocumentWithPermission(@Res() res) {
        const documents = await this.bookService.getAll();
        return res.status(HttpStatus.OK).json(documents);
    }
    
    // Retrieve documents list
    @Get('getAll')
    async getAlldocument(@Res() res) {
        const documents = await this.bookService.getAll();
        return res.status(HttpStatus.OK).json(documents);
    }

    // Fetch a particular document using ID
    @Get(':id')
    async getdocument(@Res() res, @Param('id') id) {
        const document = await this.bookService.getById(id);
        if (!document) throw new NotFoundException('document does not exist!');
        return res.status(HttpStatus.OK).json(document);
    }

    // Fetch a particular document using ID
    @Get('check/:id')
    async documentExists(@Res() res, @Param('id') id) {
        const result = await this.bookService.checkExistanceById(id);
        if (result == false) throw new NotFoundException('document does not exist!');
        return res.status(HttpStatus.OK).json(true);
    }

    // add a document
    @Post('create')
    async adddocument(@Res() res, @Body(ValidationPipe) createDto: CreateBookDto) {
        const document = await this.bookService.addNewDocument(createDto);
        return res.status(HttpStatus.OK).json({
            message: "document has been created successfully",
            document
        })
    }

    //add a document with image
    @Post('create/image')
    @UseInterceptors(FileInterceptor('image',
        {
            storage: diskStorage({
                destination: './uploads/books',
                filename: (req, file, cb) => {
                    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
                    return cb(null, `${randomName}${extname(file.originalname)}`)
                }
            })
        }
    ))
    async uploadAvatar(@Res() res, @UploadedFile() file,@Body() body) {
        body.imageUrl = this.configService.get('APP_URI')+':'+this.configService.get('PORT')+'/'+ file.path
        const document = await this.bookService.addNewDocument(body);
        return res.status(HttpStatus.OK).json({
            message: "document has been created successfully",
            document
        })
    }

    // Update a document's details
    @Put('update/:id')
    async updatedocument(@Res() res, @Param('id') id, @Body() createdocumentDTO: any) {
        const document = await this.bookService.updateDocumet(id, createdocumentDTO);
        if (!document) throw new NotFoundException('document does not exist!');
        return res.status(HttpStatus.OK).json({
            message: 'document has been successfully updated',
            document
        });
    }

    // Delete a document
    @Delete('delete/:id')
    async deletedocument(@Res() res, @Param('id') id) {
        const document = await this.bookService.deleteDocument(id);
        if (!document) throw new NotFoundException('document does not exist');
        return res.status(HttpStatus.OK).json({
            message: 'document has been deleted',
            document
        })
    }
}
