import { IsString, IsNumber, IsOptional, Min, MinLength, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export class CreateSavingsPotDto {
  @IsString()
  @MinLength(2)
  @Transform(sanitize)
  
  name!: string;

  @IsString()
  @Transform(sanitize)
  
  emoji!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(sanitize)
  
  amount?: number;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  notes?: string;
}

export class UpdateSavingsPotDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @Transform(sanitize)
  
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  emoji?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(sanitize)
  
  amount?: number;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  notes?: string;
}
