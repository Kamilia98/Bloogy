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
import { Share, ShareDocument } from './schemas/share.schema';

interface FindAllOptions {
  category?: string;
  search?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
}

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Share.name) private shareModel: Model<ShareDocument>,
  ) {}

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
    const savedBlog = await blog.save();
    const createdBlog = await savedBlog.populate('user', 'name email avatar');
    return createdBlog;
  }

  async findAll(options: FindAllOptions): Promise<BlogDocument[]> {
    const { category, search, limit = 10, page = 1, sortBy } = options;
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
      .populate('user', 'name email avatar')
      .populate({
        path: 'likes',
        select: 'name email avatar',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name email avatar',
        },
      });

    return blogs;
  }

  async findOne(id: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findById(id)
      .populate('user', 'name email avatar')
      .populate({
        path: 'likes',
        select: 'name email avatar',
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name email avatar',
        },
      });

    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async findByUser(userId: string): Promise<BlogDocument[]> {
    // Fetch blogs directly authored by the user
    const userBlogs = await this.blogModel
      .find({ user: userId, isDeleted: false })
      .populate('user', 'name email avatar')
      .populate('likes', 'name email avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'name email avatar',
        },
      });

    // Fetch blogs shared by the user
    const sharedBlogs = await this.shareModel
      .find({ sharedBy: userId })
      .populate({
        path: 'blog',
        populate: {
          path: 'user',
          select: 'name email avatar',
        },
      });

    // Combine authored and shared blogs
    const combinedBlogs = [...userBlogs, ...sharedBlogs];

    // Helper to get the relevant date for sorting
    const getBlogDate = (item: any): Date => {
      return item.createdAt || item.blog?.createdAt || new Date(0);
    };

    // Sort blogs by date descending
    const sortedBlogs = combinedBlogs.sort(
      (a, b) => getBlogDate(b).getTime() - getBlogDate(a).getTime(),
    );

    // Normalize the array to return blog documents only
    const resultBlogs = sortedBlogs.map((item: any) =>
      item.blog ? item.blog : item,
    );
    console.log('resultBlogs', resultBlogs);
    return resultBlogs;
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
    const savedBlog = blog.save();
    const resultBlog = blog.populate('likes', 'name email avatar');
    return resultBlog;
  }

  async share(id: string, req: RequestWithUser): Promise<ShareDocument> {
    const userId = this.getUserId(req);
    const blog = await this.blogModel.findById(id);

    if (!blog || blog.isDeleted) {
      throw new NotFoundException('Blog not found');
    }
    const share = new this.shareModel({
      blog: blog._id,
      sharedBy: userId,
    });
    const createdShare = await share.save();

    return createdShare;
  }
}
