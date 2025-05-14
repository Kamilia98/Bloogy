import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    return this.blogModel.find({ isDeleted: false });
  }

  async findOne(id: string) {
    const blog = await this.blogModel.findById(id);
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
