import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaSet } from './entities/media-set.entity';
import { Demo } from '../demos/demo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaSet, Demo]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
