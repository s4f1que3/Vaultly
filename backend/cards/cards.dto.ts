import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean, Min, Length, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export class CreateCardDto {

  @IsString()
  @Transform(sanitize)
  @MaxLength(36)
  card_holder!: string;

  @IsString()
  @Transform(sanitize)
  @Length(4, 4)
  card_number!: string;

  @IsString()
  @Transform(sanitize)
  expiry_month!: string;

  @IsString()
  @Length(4, 4)
  @Transform(sanitize)
  expiry_year!: string;

  @IsEnum(['visa', 'mastercard', 'amex'])
  @Transform(sanitize)
  card_type!: string;

  @IsEnum(['credit', 'debit'])
  @Transform(sanitize)
  card_kind!: string;

  @IsEnum(['green', 'dark', 'brown', 'purple', 'gold'])
  @Transform(sanitize)
  theme!: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @Transform(sanitize)
  balance!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @Transform(sanitize)
  credit_limit?: number;
}

export class UpdateCardDto {

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  card_holder?: string;

  @IsOptional()
  @Transform(sanitize)
  @IsEnum(['green', 'dark', 'brown', 'purple', 'gold'])
  theme?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @Transform(sanitize)
  balance?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @Transform(sanitize)
  credit_limit?: number;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  expiry_month?: string;

  @IsOptional()
  @IsString()
  @Length(4, 4)
  @Transform(sanitize)
  expiry_year?: string;
}
