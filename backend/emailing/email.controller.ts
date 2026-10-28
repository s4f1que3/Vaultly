import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { emailingService } from "./emailing.service";
import { emailDTO } from "./email.dto";

@Controller('email')
export class emailController {

    constructor(private readonly email: emailingService){}

    @Post('send')
    async sendEmail (@Body() dto: emailDTO, @Req() req: Request & {user: any}) {
        const school_id = req.user.app_metadata.school_id
        return await this.email.sendEmail(dto.message, dto.subject, school_id)
    }
}
