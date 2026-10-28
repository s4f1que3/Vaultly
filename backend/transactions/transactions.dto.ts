import { IsString, IsNumber, IsInt, IsEnum, IsOptional, IsDateString, Min, MinLength, MaxLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Empty string from the form means "no bank account"
const emptyToNull = ({ value }: { value: unknown }) => (value === '' ? null : value);
const sanitize = ({ value }: { value: unknown }) => typeof value === 'string' ? value.replace(/<\/?[^>]+(>|$)/g, "") : value;

export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionCategory =
  | 'food' | 'transport' | 'shopping' | 'entertainment' | 'health'
  | 'utilities' | 'housing' | 'education' | 'salary' | 'investment'
  | 'transfer' | 'other' | 'general';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01)
  @Transform(sanitize)
  
  amount!: number;

  @IsEnum(['income', 'expense', 'transfer'])
  @Transform(sanitize)
  @MaxLength(10)
  type!: TransactionType;

  @IsString()
  @MinLength(1)
  @Transform(sanitize)
  @MaxLength(30)
  category!: TransactionCategory;

  @IsOptional()
  @IsEnum(['increase', 'decrease', 'none'])
  budget_impact?: string;

  @IsString()
  @Transform(sanitize)
  
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  merchant?: string;

  @IsDateString()
  @Transform(sanitize)
  
  date!: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  @MaxLength(36)
  card_id?: string;

  @IsOptional()
  @IsString()
  @Transform(emptyToNull)
  @Transform(sanitize)
  @MaxLength(36)
  bank_account_id?: string | null;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Transform(sanitize)
  
  amount?: number;

  @IsOptional()
  @IsEnum(['income', 'expense', 'transfer'])
  @Transform(sanitize)
  
  type?: TransactionType;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  @MaxLength(36)
  category?: TransactionCategory;

  @IsOptional()
  @Transform(sanitize)
  
  @IsEnum(['increase', 'decrease', 'none'])
  budget_impact?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  description?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  merchant?: string;

  @IsOptional()
  @IsDateString()
  @Transform(sanitize)
  
  date?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  @MaxLength(36)
  card_id?: string;

  @IsOptional()
  @IsString()
  @Transform(emptyToNull)
  @Transform(sanitize)
  
  bank_account_id?: string | null;
}

export class TransactionQueryDto {

  @IsOptional()
  @IsEnum(['income', 'expense', 'transfer'])
  @Transform(sanitize)
  
  type?: TransactionType;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  category?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  search?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  dateFrom?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  dateTo?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  @MaxLength(36)
  cardId?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  
  merchant?: string;

  @IsOptional()
  @IsString()
  @Transform(sanitize)
  @MaxLength(36)
  bankAccountId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
