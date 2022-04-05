import {
    Column, CreateDateColumn, Entity, Index, ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Card} from '../../types/card';
import {Rating} from '../../types/rating';
import {User} from '../../types/user';
import {CardModel} from '../card/card.model';
import {UserModel} from '../user/user.model';

@Entity()
@Index('unique_by_user_and_card', (rating: RatingModel) => [rating.user, rating.card], { unique: true })
export class RatingModel implements Rating {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserModel, {
        eager: true,
        nullable: false,
    })
    user: User;

    @ManyToOne(() => CardModel, {
        nullable: false,
    })
    card: Card;

    @Column('int')
    rating: number;

    @CreateDateColumn()
    date: Date;
}
