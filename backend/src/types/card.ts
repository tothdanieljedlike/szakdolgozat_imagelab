import {CardComment} from './comment';
import {Map} from './map';
import {Rating} from './rating';
import {User} from './user';

export class Card {
    id?: number;
    name: string;
    author: User;
    description: string;
    comments: CardComment[];
    maps: Map[];
    downloadLink: string;
    ratings: Rating[];
}
