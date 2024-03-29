import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInOBJ, SignUpOBJ, VerificationCodeOBJ } from './auth.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post("/login")
    async login(@Body() signInOBJ: SignInOBJ){
        return await this.authService.login(signInOBJ);
    }

    @Post("/signup")
    async signup(@Body() signUpOBJ: SignUpOBJ){
        return await this.authService.signup(signUpOBJ);
    }

    @Post("/verify")
    async verifyEmail(@Body() verificationCodeOBJ: VerificationCodeOBJ){
        return await this.authService.checkVerificationCode(verificationCodeOBJ);
    }

}
