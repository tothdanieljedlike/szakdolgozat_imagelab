import {Card} from '../card';
import {User} from '../../../users/user';

export class Rating {
    id: number;
    user: User;
    card: Card;
    rating: number;
    date?: Date;
}
