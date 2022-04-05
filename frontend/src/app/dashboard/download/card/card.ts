import {Rating} from './rating/rating';
import {User} from '../../users/user';
import {Map} from '../../map/map';
import {Comment} from './comment';

export class Card {
  id: number;
  name: string;
  author: User;
  description: string;
  comments: Comment[];
  maps: Map[];
  downloadLink: string;
  ratings: Rating[];
}
