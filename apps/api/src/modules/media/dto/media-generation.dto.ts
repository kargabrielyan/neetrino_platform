import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateMediaDto {
  @ApiProperty({ description: 'Demo ID to generate media for' })
  @IsUUID()
  demoId: string;

  @ApiProperty({ 
    description: 'Media types to generate', 
    enum: ['poster', 'screenshots', 'all'],
    default: 'all'
  })
  @IsOptional()
  @IsEnum(['poster', 'screenshots', 'all'])
  type?: 'poster' | 'screenshots' | 'all' = 'all';

  @ApiProperty({ 
    description: 'Screenshot sizes to generate',
    type: [String],
    default: ['375', '768', '1280']
  })
  @IsOptional()
  screenshots?: string[] = ['375', '768', '1280'];
}

export class MediaSetDto {
  @ApiProperty({ description: 'Media set ID' })
  id: string;

  @ApiProperty({ description: 'Demo ID' })
  demoId: string;

  @ApiProperty({ description: 'LCP poster URL' })
  lcpUrl: string;

  @ApiProperty({ description: 'Mobile screenshot URL (375px)' })
  shot375Url: string;

  @ApiProperty({ description: 'Tablet screenshot URL (768px)' })
  shot768Url: string;

  @ApiProperty({ description: 'Desktop screenshot URL (1280px)' })
  shot1280Url: string;

  @ApiProperty({ description: 'Thumbnail URL' })
  thumbnailUrl: string;

  @ApiProperty({ description: 'Generation status' })
  status: string;

  @ApiProperty({ description: 'Error message if failed' })
  error: string;

  @ApiProperty({ description: 'Media metadata' })
  metadata: any;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}
