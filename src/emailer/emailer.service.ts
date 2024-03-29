import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SendMailOptions, createTransport } from "nodemailer";

@Injectable()
export class EmailerService {

    constructor(private readonly config: ConfigService){

        this._hostEmail = this.config.get("EMAIL");
        this._hostPwd = this.config.get("EMAILPASS");
    }

    private _hostEmail: string
    private _hostPwd: string

    sendEmail(receiverEmail: string, subject: string,contentHTML: string){
        const transport = createTransport({
            service: "gmail",
            auth: {
                user: this._hostEmail,
                pass: this._hostPwd
            }
        });

        const mailOptions: SendMailOptions = {
            from: this._hostEmail,
            to: receiverEmail,
            subject: subject,
            html: contentHTML
        }

        transport.sendMail(mailOptions);
    }

}
