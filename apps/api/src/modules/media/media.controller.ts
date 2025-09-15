import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { GenerateMediaDto, MediaSetDto } from './dto/media-generation.dto';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate media for demo (poster and screenshots)' })
  @ApiResponse({ status: 201, description: 'Media generation started' })
  @ApiResponse({ status: 404, description: 'Demo not found' })
  generateMedia(@Body() generateMediaDto: GenerateMediaDto): Promise<MediaSetDto> {
    return this.mediaService.generateMedia(generateMediaDto);
  }

  @Get('sets')
  @ApiOperation({ summary: 'Get media sets with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, description: 'Filter by status' })
  @ApiResponse({ status: 200, description: 'Media sets retrieved successfully' })
  getMediaSets(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.mediaService.getMediaSets(page, limit, status);
  }

  @Get('sets/:demoId')
  @ApiOperation({ summary: 'Get media set by demo ID' })
  @ApiResponse({ status: 200, description: 'Media set retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Media set not found' })
  getMediaSet(@Param('demoId') demoId: string): Promise<MediaSetDto> {
    return this.mediaService.getMediaSet(demoId);
  }

  @Post('sets/:demoId/regenerate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Regenerate media for demo' })
  @ApiResponse({ status: 200, description: 'Media regeneration started' })
  @ApiResponse({ status: 404, description: 'Demo not found' })
  regenerateMedia(@Param('demoId') demoId: string): Promise<MediaSetDto> {
    return this.mediaService.regenerateMedia(demoId);
  }

  @Delete('sets/:demoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete media set for demo' })
  @ApiResponse({ status: 204, description: 'Media set deleted successfully' })
  @ApiResponse({ status: 404, description: 'Media set not found' })
  deleteMediaSet(@Param('demoId') demoId: string): Promise<void> {
    return this.mediaService.deleteMediaSet(demoId);
  }
}
