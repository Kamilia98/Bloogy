import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Share, ShareSchema } from './schemas/share.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Share.name, schema: ShareSchema }]),
  ],
  controllers: [BlogsController],
  providers: [BlogsService],
  exports: [BlogsService, MongooseModule],
})
export class BlogsModule {}
