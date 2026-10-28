import { IsString, IsNumber, IsEnum, IsOptional, IsInt, IsBoolean, Min, Max, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export class CreateSubscriptionDto {

  @IsString()
  @Transform(sanitize)
  
  company!: string;

  @IsNumber()
  @Min(0.01)
  @Transform(sanitize)
  
  amount!: number;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  @MaxLength(36)
  card_id?: string;

  @IsEnum(['monthly', 'yearly'])
  @Transform(sanitize)
  @MaxLength(10)
  period!: 'monthly' | 'yearly';

  @IsInt()
  @Min(1)
  @Max(31)
  @Transform(sanitize)
  
  billing_day!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  @Transform(sanitize)
  
  billing_month?: number;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  icon?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  color?: string;
}

export class UpdateSubscriptionDto {

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  company?: string;

  @IsOptional()
  @IsNumber()
  @Transform(sanitize)
  
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  card_id?: string;

  @IsOptional()
  @IsEnum(['monthly', 'yearly'])
  @Transform(sanitize)
  
  period?: 'monthly' | 'yearly';

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  @Transform(sanitize)
  
  billing_day?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  @Transform(sanitize)
  
  billing_month?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(sanitize)
  
  is_active?: boolean;

  @IsOptional()
  @Transform(sanitize)
  
  @IsString()
  icon?: string;

  @IsOptional()
  @Transform(sanitize)
  
  @IsString()
  color?: string;
}
