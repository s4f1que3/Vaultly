import { IsString, IsNumber, IsOptional, Min, Max, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export class CreateBudgetDto {

  @IsString()
  @Transform(sanitize)
  category!: string;

  @IsNumber()
  @Min(0.01)
  @Transform(sanitize)
  limit_amount!: number;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  period?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Transform(sanitize)
  alert_threshold?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(sanitize)
  name?: string

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  icon!: string

}

export class UpdateBudgetDto {

  @IsString()
  @IsOptional()
  @Transform(sanitize)
  category?: string;

  @IsNumber()
  @Min(0.01)
  @IsOptional()
  @Transform(sanitize)
  limit_amount?: number;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  period?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Transform(sanitize)
  alert_threshold?: number;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(sanitize)
  name?: string

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  icon?: string
}
