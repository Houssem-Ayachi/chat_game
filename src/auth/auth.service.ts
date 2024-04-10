import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';

import { hash, compare } from "bcrypt";
import { EmailerService } from 'src/emailer/emailer.service';
import { SignInOBJ, SignUpOBJ, VerificationCodeOBJ } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly emailer: EmailerService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ){}

    private _verificationCodes = new Map<string ,number>();
    private _randomMin = 100;
    private _randomMax = 999;
    private second = 1000;
    private minute = 60;
    private _verificationDuration = 4 * this.minute * this.second; //stays for 4 minutes in storage (_verificationCodes)

    async login(signinOBJ: SignInOBJ){
        let user = await this.userService.findUserByLogin(signinOBJ.login);
        if(user == null){
            throw new NotFoundException("user not found");
        }
        if(!await compare(signinOBJ.password, user.password)){
            throw new BadRequestException("password incorrect");
        }
        return {access_key: await this.generateAccessKey(user._id.toString())}
    }

    async signup(signupObj: SignUpOBJ){
        let user = await this.userService.getUserByEmail(signupObj.email);
        if(user !== null){
            throw new NotAcceptableException("email already exists");
        }
        signupObj.password = await this.hashPasswrod(signupObj.password);
        user = await this.userService.addUser(signupObj);
        this.sendVerificationEmail(signupObj.email);
        return {access_key: await this.generateAccessKey(user._id.toString())}
    }

    async checkVerificationCode(verificationObj: VerificationCodeOBJ){
        if(this._verificationCodes[verificationObj.email] === undefined){
            throw new NotFoundException("this email doesn't have a verification code");
        }
        if(this._verificationCodes[verificationObj.email] !== verificationObj.code){
            throw new BadRequestException("wrong verification code");
        }
        await this.userService.markUserAsVerified(verificationObj.email);
        return {response: "email verified"};
    }

    private async sendVerificationEmail(email: string){
        const random = Math.round(Math.random() * (this._randomMax - this._randomMin) + this._randomMin);
        const htmlBody = `
            <div>
                <h3>Copy code below to confirm your email</h3>
                <p>CODE --> ${random}</p>
            </div>
        `;
        this._verificationCodes[email] = random;
        new Promise(res => {
            setTimeout(() => {
                delete this._verificationCodes[email];
                res("");
            }, this._verificationDuration);
        });
        this.emailer.sendEmail(email, "Verify your email", htmlBody);
    }

    private async hashPasswrod(password: string){
        return await hash(password, 10);
    }

    private async generateAccessKey(userId: string){
        const key = await this.jwtService.signAsync({sub: userId, createdAt: new Date()}, {secret: this.configService.get("JWT_SECRET")});
        return key;
    }
}
