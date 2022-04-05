import {Injectable} from '@angular/core';
import {HttpCrud} from '../../../../HttpCrud';
import {Rating} from './rating';

@Injectable()
export class RatingService extends HttpCrud<Rating> {
  apiUrl = '/api/rating';
}
