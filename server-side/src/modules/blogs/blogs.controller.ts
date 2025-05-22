import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { RequestWithUser } from './entities/request-with-user.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createBlogDto: CreateBlogDto, @Req() req: RequestWithUser) {
    return this.blogsService.create(createBlogDto, req);
  }

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.blogsService.findAll({ category, search, limit, page, sortBy });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.blogsService.findByUser(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @Req() req: RequestWithUser,
  ) {
    return this.blogsService.update(id, updateBlogDto, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.blogsService.remove(id, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('like/:id')
  like(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.blogsService.like(id, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('share/:id')
  share(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.blogsService.share(id, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('share/:id')
  deleteShare(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.blogsService.deleteShare(id, req);
  }
}
