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
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../blogs/entities/request-with-user.interface';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':id')
  comment(
    @Param('id') id: string,
    @Body() commentDto: CreateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.create(id, commentDto, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteComment(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.delete(id, req);
  }


  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateComment(
    @Param('id') id: string,
    @Body() commentDto: UpdateCommentDto,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.update(id, commentDto, req);
  }
}
