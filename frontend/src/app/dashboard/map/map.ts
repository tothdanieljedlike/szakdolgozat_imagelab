import {Card} from '../download/card/card';

export class Map {
    id: number;
    name: string;
    lat: number;
    lng: number;
    imageSrc: string;
    card?: Card;
}
