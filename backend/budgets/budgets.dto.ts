import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export class CreateBudgetDto {
  @IsString()
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
}

export class UpdateBudgetDto {

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Transform(sanitize)
  limit_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(sanitize)
  alert_threshold?: number;
}
