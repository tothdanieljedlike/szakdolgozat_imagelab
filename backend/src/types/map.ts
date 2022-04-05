import {Card} from './card';

export class Map {
    id: number;
    name: string;
    card?: Card;
    lat: number;
    lng: number;
    imageSrc: string;
}
