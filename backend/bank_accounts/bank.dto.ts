import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export class CreateBankAccountDto {

    @IsString()
    @MaxLength(160)
    @Transform(sanitize)
    name!: string

    @IsNumber()
    balance!: number

    @IsString()
    @IsOptional()
    @MaxLength(36)
    @Transform(sanitize)
    card_linked?: string

}

export class UpdateBankAccountDto {

    @IsString()
    @IsOptional()
    @MaxLength(160)
    @Transform(sanitize)
    name?: string

    @IsNumber()
    @IsOptional()
    balance?: number

    @IsString()
    @IsOptional()
    @MaxLength(36)
    @Transform(sanitize)
    card_linked?: string 

}
