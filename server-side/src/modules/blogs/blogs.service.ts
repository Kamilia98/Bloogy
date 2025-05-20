import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestWithUser } from './entities/request-with-user.interface';
import mongoose from 'mongoose';

interface FindAllOptions {
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
}

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  private getUserId(req: RequestWithUser): string {
    return req.user.userId;
  }

  async create(
    createBlogDto: CreateBlogDto,
    req: RequestWithUser,
  ): Promise<BlogDocument> {
    const userId = this.getUserId(req);
    const blog = new this.blogModel({
      ...createBlogDto,
      user: userId,
    });
    return blog.save();
  }

  async findAll(options: FindAllOptions): Promise<BlogDocument[]> {
    const { category, search, limit = 10, page = 1, sortBy } = options;
    // Explicitly type `query` as a record with string keys and unknown values
    const query: Record<string, any> = { isDeleted: false };

    if (category) {
      query.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ title: searchRegex }, { content: searchRegex }];
    }

    const sortOptions: Record<string, 1 | -1> = sortBy
      ? { [sortBy]: -1 }
      : { createdAt: -1 };

    const blogs: BlogDocument[] = await this.blogModel
      .find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'name email')
      .populate({
        path: 'likes',
        select: 'name email avatar', // Populate likers
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name email avatar',
        },
      });
    // Populate the user field with name and email

    return blogs;
  }

  async findOne(id: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findById(id)
      .populate('user', 'name email') // Populate blog creator
      .populate({
        path: 'likes',
        select: 'name email avatar', // Populate likers
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name email avatar', // Populate commenter
        },
      });

    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    req: RequestWithUser,
  ): Promise<BlogDocument> {
    const userId = this.getUserId(req);
    const blog = await this.blogModel.findById(id);

    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.user.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to update this blog');
    }

    const updatedBlog: BlogDocument | null = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .populate('user', 'name email');

    if (!updatedBlog) {
      throw new NotFoundException('Blog not found');
    }
    return updatedBlog;
  }

  async remove(id: string, req: RequestWithUser): Promise<BlogDocument | null> {
    const userId = this.getUserId(req);
    const blog = await this.blogModel.findById(id);

    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }

    if (blog.user.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to delete this blog');
    }

    // Return the updated document
    return this.blogModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }

  async like(id: string, req: RequestWithUser): Promise<BlogDocument> {
    const userId = this.getUserId(req);
    const blog = await this.blogModel.findById(id);

    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (blog.likes.includes(userObjectId)) {
      blog.likes = blog.likes.filter((like) => like.toString() !== userId);
    } else {
      blog.likes.push(userObjectId);
    }

    return blog.save();
  }
}
