import { Injectable } from "@nestjs/common";
@Injectable()
export class emailConsole {
    get mail() {
        return {
            sendMail: async (opts: {to: string, subject: string, message: string}) => {
                console.log(`[dev email] \n to=${opts.to}, \n subject=${opts.subject}, \n message=${opts.message}`)
            }
        }
    }
}