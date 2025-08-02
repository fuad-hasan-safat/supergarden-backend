import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as MongooseUser } from '../users/user.schema';


@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async login(user: { _id: string; email: string }) {
        const payload = { username: user.email, sub: user._id };
        return { access_token: this.jwtService.sign(payload) };
    }

}
