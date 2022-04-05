import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Card} from '../../types/card';
import {Map} from '../../types/map';
import {CardModel} from '../card/card.model';

@Entity()
export class MapModel implements Map {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    name: string;

    @ManyToOne(() => CardModel)
    card?: Card;

    @Column({
        nullable: false,
        type: 'double',
    })
    lat: number;

    @Column({
        nullable: false,
        type: 'double',
    })
    lng: number;

    @Column({
        nullable: false,
    })
    imageSrc: string;
}
