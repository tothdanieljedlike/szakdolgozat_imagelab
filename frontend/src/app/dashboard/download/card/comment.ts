import {User} from '../../users/user';
import {Card} from './card';


export class Comment {
    id: number;
    text: string;
    author: User;
    card: Card;
    date: Date;
}
