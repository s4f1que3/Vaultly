import { Injectable } from '@nestjs/common'
import { Email } from '@emailing/email.class'
import { buildMessageEmail } from '@emailing/email.template'

@Injectable()
export class emailingService {

    constructor(private readonly email: Email){}

    async sendEmail (message: string, subject: string, email: string) {
        return await this.email.mail.sendMail({
            from: process.env.EMAIL_SENDER,
            replyTo: 'safiquesamuel95c@gmail.com',
            to: email,
            subject: subject,
            text: message,
            html: buildMessageEmail(subject, message, email)
        })
    }

    async sendDenyEmail (message: string, subject: string, email: string, reason?: string) {
        if(reason) {
            const newMessage = `${message}. Reason for your denial: ${reason}. Please feel free to contact us or reapply if you think a mistake has been made.`
                return await this.email.mail.sendMail({
                from: process.env.EMAIL_SENDER,
                replyTo: "safiquesamuel95c@gmail.com",
                to: email,
                subject: subject,
                text: newMessage,
                html: buildMessageEmail(subject, newMessage, email)
            })
        }
        
        return await this.email.mail.sendMail({
            from: process.env.EMAIL_SENDER,
            replyTo: "safiquesamuel95c@gmail.com",
            to: email,
            subject: subject,
            text: message,
            html: buildMessageEmail(subject, message, email)
        })
    }
    
}