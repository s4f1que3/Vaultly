import { Injectable } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsEmail, IsString, MaxLength, IsBoolean, IsOptional, IsUUIDVersion, IsUUID } from "class-validator";
import { UUID } from "crypto";

const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

@Injectable()
export class authDTO {
    @IsEmail()
    @Transform(sanitize)
    @MaxLength(75)
    email!: string
}

@Injectable()
export class changeEmailDTO {
    @IsEmail()
    @Transform(sanitize)
    @MaxLength(75)
    current_email!: string

    @IsEmail()
    @Transform(sanitize)
    @MaxLength(75)
    new_email!: string

    @IsString()
    @MaxLength(70)
    password!: string
}