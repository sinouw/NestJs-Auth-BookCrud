
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

  async validateUserMongo(username: string, password: string): Promise<any> {
    //checking if user exists
    const user = await this.userModel.findOne({ username: username });
    //if user does not exist throw NotFoundException
    if(!user) throw new NotFoundException("User Not Found")
    //checking if the passwords matches 
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const { password, ...result } = user;
      return result;
    }else{
      //passwords does not matches
      throw new BadRequestException("Wrong Password")
    }
  }

  // create a user
  async create(createUserDTO: any): Promise<User> {
    try {
      const newUser = await this.userModel(createUserDTO);
      let result = await newUser.save();
      return result
    } catch (e) {
      if(e.code == 11000){
        //duplication error
        let keys = Object.keys(e.keyPattern)
        throw new BadRequestException(`Sorry, it looks like that ${keys} is already taken.`)
      }else{
        throw e
      }
    }
  }

  async login(user: any): Promise<any> {
      // token generation
    const payload = { username: user.username, sub: user._id };
    // token generation
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}


