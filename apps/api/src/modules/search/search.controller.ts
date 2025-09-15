import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto, SearchResponseDto } from './dto/search-query.dto';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Search demos with advanced filtering and sorting' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  search(@Query() query: SearchQueryDto): Promise<SearchResponseDto> {
    return this.searchService.search(query);
  }

  @Get('suggestions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get search suggestions based on query' })
  @ApiResponse({ status: 200, description: 'Search suggestions retrieved successfully' })
  getSuggestions(@Query('q') query: string): Promise<string[]> {
    return this.searchService.getSearchSuggestions(query);
  }
}
