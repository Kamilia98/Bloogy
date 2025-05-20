import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { RequestWithUser } from '../blogs/entities/request-with-user.interface';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Blog, BlogDocument } from '../blogs/schemas/blog.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
  ) {}

  private getUserId(req: RequestWithUser): string {
    return req.user.userId;
  }

  async create(
    id: string,
    commentDto: CreateCommentDto,
    req: RequestWithUser,
  ): Promise<CommentDocument> {
    const userId = this.getUserId(req);
    const blog = await this.blogModel.findById(id);

    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }

    const createdComment = await this.commentModel.create({
      user: userId,
      content: commentDto.content,
      blog: blog._id,
    });

    const returnComment = createdComment.populate('user', 'name email avatar ');

    blog.comments.push(createdComment._id as mongoose.Types.ObjectId);
    await blog.save();

    return returnComment;
  }

  async delete(id: string, req: RequestWithUser): Promise<CommentDocument> {
    const userId = this.getUserId(req);
    const comment = await this.commentModel
      .findById(id)
      .populate('blog', 'comments');

    if (!comment || comment.isDeleted) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.toString() !== userId) {
      throw new NotFoundException(
        'You are not authorized to delete this comment',
      );
    }

    comment.isDeleted = true;
    await comment.save();

    const blog = await this.blogModel.findById(comment.blog._id);
    if (blog) {
      blog.comments = blog.comments.filter(
        (commentId) => commentId.toString() !== id,
      );
      await blog.save();
    }

    return comment;
  }

  async update(
    id: string,
    commentDto: UpdateCommentDto,
    req: RequestWithUser,
  ): Promise<CommentDocument> {
    const userId = this.getUserId(req);
    const comment = await this.commentModel.findById(id);
    if (!comment || comment.isDeleted) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.toString() !== userId) {
      throw new NotFoundException(
        'You are not authorized to update this comment',
      );
    }

    comment.content = commentDto.content;
    await comment.save();

    return comment.populate('user', 'name email avatar ');
  }
}
