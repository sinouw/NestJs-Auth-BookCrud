import * as mongoose from 'mongoose';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';


export const BookSchema = new mongoose.Schema({
    title: { type: String, required : true},
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
}, { timestamps: true });

export interface  Book extends mongoose.Document {
    readonly _id  : string;
    readonly title: string;
    readonly description: string;
    readonly imageUrl: string;
}

export class CreateBookDto {
    @IsString()
    description: string;
  
    @IsString()
    @IsNotEmpty()
    title: string;
  }
