import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Card} from '../../types/card';
import {CardComment} from '../../types/comment';
import {User} from '../../types/user';
import {CardModel} from '../card/card.model';
import {UserModel} from '../user/user.model';

@Entity()
export class CardCommentModel implements CardComment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    text: string;

    @ManyToOne(() => UserModel, {
        eager: true,
    })
    author: User;

    @ManyToOne(() => CardModel)
    card: Card;

    @CreateDateColumn()
    date: Date;
}
