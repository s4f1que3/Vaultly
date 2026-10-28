import { IsString, IsNumber, IsOptional, Min, Max, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export class SimulateDto {
  @IsNumber()
  @Min(0.01)
  @Transform(sanitize)
  
  amount!: number;

  @IsString()
  @Transform(sanitize)
  
  category!: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  description?: string;
}

export class ProjectionsQueryDto {
  @IsOptional()
  @Min(7)
  @Max(90)
  @Transform(sanitize)
  
  days?: number = 30;
}

export class CategorySuggestDto {
  @IsString()
  @Transform(sanitize)
  
  merchant!: string;
}
