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

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  private getUserId(req: Request & { user: { userId: string } }) {
    const user = req.user as { userId: string };
    return user.userId;
  }

  async create(
    createBlogDto: CreateBlogDto,
    req: Request & { user: { userId: string } },
  ) {
    const userId = this.getUserId(req);
    const blog = new this.blogModel({
      ...createBlogDto,
      user: userId,
    });
    return blog.save();
  }

  async findAll(category?: string, search?: string, limit?: number) {
    const query: any = { isDeleted: false };

    if (category) {
      query.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ title: searchRegex }];
    }

    const blogs = await this.blogModel
      .find(query)
      .limit(limit ? Number(limit) : 0)
      .populate('user', 'name email');

    return blogs;
  }

  async findOne(id: string) {
    const blog = await this.blogModel
      .findById(id)
      .populate('user', 'name email');
    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }
    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
    req: Request & { user: { userId: string } },
  ) {
    const userId = this.getUserId(req);
    const blog = await this.blogModel.findById(id);
    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }
    if (blog.user.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to update this blog');
    }
    return this.blogModel.findByIdAndUpdate(id, updateBlogDto, { new: true });
  }

  async remove(id: string) {
    const blog = await this.blogModel.findById(id);
    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }
    return this.blogModel.findByIdAndDelete(id);
  }
}
