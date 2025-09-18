import { IsString, IsEmail, IsOptional, IsNumber, IsEnum, IsUUID, IsDateString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../order.entity';

export class CreateOrderDto {
  @ApiProperty({ description: 'Customer name', example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  customerName: string;

  @ApiProperty({ description: 'Customer email', example: 'john@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone', example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  customerPhone?: string;

  @ApiProperty({ description: 'Demo ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  demoId: string;

  @ApiProperty({ description: 'Project requirements', example: 'Need a modern e-commerce website', required: false })
  @IsOptional()
  @IsString()
  requirements?: string;

  @ApiProperty({ description: 'Project budget', example: 5000, required: false })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiProperty({ description: 'Order status', enum: OrderStatus, default: OrderStatus.NEW, required: false })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ description: 'Additional notes', example: 'Urgent project', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Assigned to', example: 'developer@company.com', required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({ description: 'Project deadline', example: '2024-12-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
