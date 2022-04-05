import {Injectable} from '@angular/core';
import {HttpCrud} from '../../../HttpCrud';
import {Comment} from './comment';

@Injectable()
export class CommentService extends HttpCrud<Comment> {
  apiUrl = '/api/comment';

  getByCardId(id: number) {
    return this.get(`/card/${id}`);
  }
}
