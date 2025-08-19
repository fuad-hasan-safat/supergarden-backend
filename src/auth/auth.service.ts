import { JwtService } from '@nestjs/jwt';
import { User as MongooseUser, UserRole } from '../users/user.schema';
import { Injectable } from '@nestjs/common';


@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async login(user: { _id: string; email: string; role: UserRole }) {
        const payload = { username: user.email, sub: user._id, role: user.role };

        return { access_token: this.jwtService.sign(payload) };
    }
}
