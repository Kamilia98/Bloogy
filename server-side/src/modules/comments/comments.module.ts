import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { BlogsService } from '../blogs/blogs.service';
import { mongo } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from '../blogs/blogs.module';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    BlogsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, BlogsService],
  exports: [CommentsService, MongooseModule],
})
export class CommentsModule {}
