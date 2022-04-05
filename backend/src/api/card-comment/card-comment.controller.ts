import {Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post} from 'routing-controllers';
import {SuperController} from '../../super/super.controller';
import {CardComment} from '../../types/comment';
import {ROLES, User} from '../../types/user';
import {CardCommentModel} from './card-comment.model';
import {CardCommentRepository} from './card-comment.repository';

@JsonController('/comment')
export class CardCommentController extends SuperController<CardCommentModel> {
    constructor() {
        super(new CardCommentRepository(CardCommentModel));
    }

    @Get('/card/:id')
    getByCardId(
        @Param('id') id: number,
    ): Promise<CardCommentModel[]> {
        return (this.repository as CardCommentRepository).getByCardId(id);
    }

    @Post()
    @Authorized()
    add(
        @Body() comment: CardComment,
        @CurrentUser() user: User): Promise<CardCommentModel> {
        comment.author = user;
        comment.date = new Date();
        return super.add(comment);
    }

    @Delete('/id/:id')
    @Authorized()
    async delete(
        @Param('id') id: number,
        @CurrentUser() user: User,
    ): Promise<CardCommentModel> {
        const comment = await this.getById(id);
        canAccess(comment, user);
        return super.delete(comment);
    }
}

function canAccess(comment: CardComment, user: User) {
    if (user.role === ROLES.ADMIN) {
        return true;
    }
    return comment.author.id === user.id;
}
