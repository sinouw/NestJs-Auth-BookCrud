import { Injectable, HttpException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class MyAuthGuard extends AuthGuard('jwt') {

  handleRequest(err, user, info: Error) {
    if(info)
    //Unauthorized
     throw new HttpException(info.message, 401)
     return user;
  }

}