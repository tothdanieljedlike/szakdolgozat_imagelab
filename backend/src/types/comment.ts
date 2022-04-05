import {Card} from './card';
import {User} from './user';

export class CardComment {
    id: number;
    text: string;
    author: User;
    card: Card;
    date: Date;
}
