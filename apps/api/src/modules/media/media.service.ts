import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaSet } from './entities/media-set.entity';
import { Demo } from '../demos/demo.entity';
import { GenerateMediaDto, MediaSetDto } from './dto/media-generation.dto';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaSet)
    private mediaSetRepository: Repository<MediaSet>,
    @InjectRepository(Demo)
    private demoRepository: Repository<Demo>,
  ) {}

  async generateMedia(generateMediaDto: GenerateMediaDto): Promise<MediaSetDto> {
    const demo = await this.demoRepository.findOne({
      where: { id: generateMediaDto.demoId },
    });

    if (!demo) {
      throw new NotFoundException(`Demo with ID ${generateMediaDto.demoId} not found`);
    }

    // Проверяем, существует ли уже медиа-набор
    let mediaSet = await this.mediaSetRepository.findOne({
      where: { demoId: generateMediaDto.demoId },
    });

    if (!mediaSet) {
      mediaSet = this.mediaSetRepository.create({
        demoId: generateMediaDto.demoId,
        status: 'pending',
      });
      mediaSet = await this.mediaSetRepository.save(mediaSet);
    }

    // Обновляем статус на "генерируется"
    mediaSet.status = 'generating';
    await this.mediaSetRepository.save(mediaSet);

    try {
      // Здесь будет реальная логика генерации медиа
      // Пока что используем заглушки
      const generatedMedia = await this.performMediaGeneration(demo.url, generateMediaDto);

      // Обновляем медиа-набор с результатами
      mediaSet.lcpUrl = generatedMedia.lcpUrl;
      mediaSet.shot375Url = generatedMedia.shot375Url;
      mediaSet.shot768Url = generatedMedia.shot768Url;
      mediaSet.shot1280Url = generatedMedia.shot1280Url;
      mediaSet.thumbnailUrl = generatedMedia.thumbnailUrl;
      mediaSet.metadata = generatedMedia.metadata;
      mediaSet.status = 'completed';
      mediaSet.error = null;

      await this.mediaSetRepository.save(mediaSet);

    } catch (error) {
      mediaSet.status = 'failed';
      mediaSet.error = error.message;
      await this.mediaSetRepository.save(mediaSet);
    }

    return this.mapToDto(mediaSet);
  }

  async getMediaSet(demoId: string): Promise<MediaSetDto> {
    const mediaSet = await this.mediaSetRepository.findOne({
      where: { demoId },
      relations: ['demo'],
    });

    if (!mediaSet) {
      throw new NotFoundException(`Media set for demo ${demoId} not found`);
    }

    return this.mapToDto(mediaSet);
  }

  async getMediaSets(
    page: number = 1,
    limit: number = 20,
    status?: string,
  ): Promise<{ data: MediaSetDto[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.mediaSetRepository
      .createQueryBuilder('mediaSet')
      .leftJoinAndSelect('mediaSet.demo', 'demo')
      .orderBy('mediaSet.createdAt', 'DESC');

    if (status) {
      queryBuilder.where('mediaSet.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: data.map(mediaSet => this.mapToDto(mediaSet)),
      total,
      page,
      limit,
    };
  }

  async regenerateMedia(demoId: string): Promise<MediaSetDto> {
    const mediaSet = await this.mediaSetRepository.findOne({
      where: { demoId },
    });

    if (!mediaSet) {
      throw new NotFoundException(`Media set for demo ${demoId} not found`);
    }

    return this.generateMedia({
      demoId,
      type: 'all',
    });
  }

  async deleteMediaSet(demoId: string): Promise<void> {
    const mediaSet = await this.mediaSetRepository.findOne({
      where: { demoId },
    });

    if (!mediaSet) {
      throw new NotFoundException(`Media set for demo ${demoId} not found`);
    }

    await this.mediaSetRepository.remove(mediaSet);
  }

  private async performMediaGeneration(url: string, options: GenerateMediaDto): Promise<{
    lcpUrl: string;
    shot375Url: string;
    shot768Url: string;
    shot1280Url: string;
    thumbnailUrl: string;
    metadata: any;
  }> {
    // Заглушка для генерации медиа
    // В реальной реализации здесь будет:
    // 1. Puppeteer/Playwright для скриншотов
    // 2. Canvas API для постера
    // 3. Загрузка в S3/R2/CDN
    
    const baseUrl = 'https://api.placeholder.com';
    const timestamp = Date.now();

    return {
      lcpUrl: `${baseUrl}/800x600/00D1FF/FFFFFF?text=LCP+Poster+${timestamp}`,
      shot375Url: `${baseUrl}/375x667/FF6B6B/FFFFFF?text=Mobile+375px+${timestamp}`,
      shot768Url: `${baseUrl}/768x1024/4ECDC4/FFFFFF?text=Tablet+768px+${timestamp}`,
      shot1280Url: `${baseUrl}/1280x720/45B7D1/FFFFFF?text=Desktop+1280px+${timestamp}`,
      thumbnailUrl: `${baseUrl}/200x150/95A5A6/FFFFFF?text=Thumbnail+${timestamp}`,
      metadata: {
        width: 1280,
        height: 720,
        format: 'png',
        size: 1024000,
        generatedAt: new Date(),
        generator: 'placeholder-service',
      },
    };
  }

  private mapToDto(mediaSet: MediaSet): MediaSetDto {
    return {
      id: mediaSet.id,
      demoId: mediaSet.demoId,
      lcpUrl: mediaSet.lcpUrl,
      shot375Url: mediaSet.shot375Url,
      shot768Url: mediaSet.shot768Url,
      shot1280Url: mediaSet.shot1280Url,
      thumbnailUrl: mediaSet.thumbnailUrl,
      status: mediaSet.status,
      error: mediaSet.error,
      metadata: mediaSet.metadata,
      createdAt: mediaSet.createdAt,
      updatedAt: mediaSet.updatedAt,
    };
  }
}
