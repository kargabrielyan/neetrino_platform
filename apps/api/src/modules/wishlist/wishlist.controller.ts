import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';

class WishlistDto {
  demoId: string;
  userId?: string;
  userEmail?: string;
}

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('toggle')
  @ApiOperation({ summary: 'Переключить избранное (добавить/удалить)' })
  @ApiBody({ type: WishlistDto })
  async toggle(@Body() dto: WishlistDto) {
    console.log('📥 POST /wishlist/toggle:', dto);
    return await this.wishlistService.toggle(dto.demoId, dto.userId, dto.userEmail);
  }

  @Post('add')
  @ApiOperation({ summary: 'Добавить в избранное' })
  @ApiBody({ type: WishlistDto })
  async add(@Body() dto: WishlistDto) {
    console.log('📥 POST /wishlist/add:', dto);
    return await this.wishlistService.add(dto.demoId, dto.userId, dto.userEmail);
  }

  @Delete('remove')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить из избранного' })
  async remove(@Body() dto: WishlistDto) {
    console.log('📥 DELETE /wishlist/remove:', dto);
    await this.wishlistService.remove(dto.demoId, dto.userId, dto.userEmail);
  }

  @Get()
  @ApiOperation({ summary: 'Получить избранное пользователя' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findByUser(
    @Query('userId') userId?: string,
    @Query('email') email?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    console.log('📥 GET /wishlist:', { userId, email, page, limit });
    return await this.wishlistService.findByUser(userId, email, page, limit);
  }

  @Get('ids')
  @ApiOperation({ summary: 'Получить ID товаров в избранном' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'email', required: false })
  async getIds(
    @Query('userId') userId?: string,
    @Query('email') email?: string,
  ) {
    console.log('📥 GET /wishlist/ids:', { userId, email });
    return await this.wishlistService.getIds(userId, email);
  }

  @Get('check/:demoId')
  @ApiOperation({ summary: 'Проверить, есть ли товар в избранном' })
  @ApiParam({ name: 'demoId', description: 'ID товара' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'email', required: false })
  async isInWishlist(
    @Param('demoId') demoId: string,
    @Query('userId') userId?: string,
    @Query('email') email?: string,
  ) {
    console.log('📥 GET /wishlist/check/:demoId:', { demoId, userId, email });
    const isInWishlist = await this.wishlistService.isInWishlist(demoId, userId, email);
    return { demoId, isInWishlist };
  }

  @Get('count')
  @ApiOperation({ summary: 'Получить количество товаров в избранном' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'email', required: false })
  async getCount(
    @Query('userId') userId?: string,
    @Query('email') email?: string,
  ) {
    console.log('📥 GET /wishlist/count:', { userId, email });
    const count = await this.wishlistService.getCount(userId, email);
    return { count };
  }
}
















