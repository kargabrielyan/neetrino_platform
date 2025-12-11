import { IsString, IsEmail, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID демо/продукта' })
  @IsUUID()
  demoId: string;

  @ApiProperty({ description: 'Имя клиента' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Email клиента' })
  @IsEmail()
  customerEmail: string;

  @ApiPropertyOptional({ description: 'Телефон клиента' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiPropertyOptional({ description: 'ID пользователя (если авторизован)' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ description: 'Примечания' })
  @IsOptional()
  @IsString()
  notes?: string;
}











