import {MinLength} from 'class-validator';
import {
    Column, Entity, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Card} from '../../types/card';
import {CardComment} from '../../types/comment';
import {Map} from '../../types/map';
import {Rating} from '../../types/rating';
import {User} from '../../types/user';
import {CardCommentModel} from '../card-comment/card-comment.model';
import {MapModel} from '../map/map.model';
import {RatingModel} from '../rating/rating.model';
import {UserModel} from '../user/user.model';

@Entity()
export class CardModel implements Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
    })
    @MinLength(3)
    name: string;

    @ManyToOne(() => UserModel, {
        eager: true,
    })
    author: User;

    @Column({
        length: 1500,
    })
    description: string;

    @OneToMany(() => MapModel, map => map.card, {
        eager: true,
        cascade: ['insert'],
    })
    maps: Map[];

    @OneToMany(() => CardCommentModel, comment => comment.card)
    comments: CardComment[];

    @Column({
        nullable: false,
    })
    downloadLink: string;

    @OneToMany(() => RatingModel, rating => rating.card, {
        eager: true,
    })
    ratings: Rating[];
}
