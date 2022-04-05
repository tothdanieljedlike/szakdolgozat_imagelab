import {Card} from './card';
import {User} from './user';

export class Rating {
    id: number;
    user: User;
    card: Card;
    rating: number;
    date?: Date;
}
