import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';
const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export class CreateCategoryDto {

  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  
  @Transform(sanitize)
  label!: string;

  @IsString()
  @Transform(sanitize)
  @Transform(sanitize)
  emoji!: string;
}
