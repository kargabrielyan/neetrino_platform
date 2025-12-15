import { IsString, IsOptional, IsEnum, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID подписки' })
  @IsUUID()
  subscriptionId: string;

  @ApiProperty({ description: 'Сумма платежа' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Валюта', default: 'AMD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Номер месяца (1-10)' })
  @IsNumber()
  monthNumber: number;

  @ApiPropertyOptional({ description: 'Метод оплаты' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({ description: 'Примечания' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePaymentStatusDto {
  @ApiProperty({ description: 'Статус платежа', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiPropertyOptional({ description: 'Примечания' })
  @IsOptional()
  @IsString()
  notes?: string;
}
















