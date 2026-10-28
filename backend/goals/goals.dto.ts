import { IsString, IsNumber, IsOptional, IsDateString, Min, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export class CreateGoalDto {

  @IsString()
  
  @Transform(sanitize)
  name!: string;

  @IsNumber()
  @Min(0.01)
  @Transform(sanitize)
  
  target_amount!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(sanitize)
  
  current_amount?: number;

  @IsOptional()
  @IsDateString()
  @Transform(sanitize)
  
  deadline?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  icon?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  color?: string;
}

export class UpdateGoalDto {

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Transform(sanitize)
  
  target_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(sanitize)
  
  current_amount?: number;

  @IsOptional()
  @IsDateString()
  @Transform(sanitize)
  
  deadline?: string;

  @IsOptional()
  @IsString()
  
  @Transform(sanitize)
  icon?: string;
}

export class ContributeDto {
  @IsNumber()
  @Min(0.01)
  @Transform(sanitize)
  
  amount!: number;
}
