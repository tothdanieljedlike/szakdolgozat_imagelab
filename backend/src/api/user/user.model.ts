import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Card} from '../../types/card';
import {CardComment} from '../../types/comment';
import {Organization} from '../../types/organization';
import {ROLES, User} from '../../types/user';
import {CardCommentModel} from '../card-comment/card-comment.model';
import {CardModel} from '../card/card.model';
import {OrganizationModel} from '../organization/organization.model';
import {RatingModel} from '../rating/rating.model';

@Entity()
export class UserModel implements User {
    @PrimaryGeneratedColumn()
    id: number = null;

    @Column({
        nullable: false,
    })
    firstName: string;

    @Column({
        nullable: false,
    })
    lastName: string;

    @Column({
        nullable: false,
        unique: true,
    })
    email: string;

    @Column({
        nullable: false,
        select: false,
    })
    password: string;

    @Column({
        select: false,
        length: 32,
        default: '',
    })
    token: string;

    @Column({
        select: false,
        length: 32,
        default: '',
    })
    reset: string;
    @Column({
        select: false,
        length: 80,
        default: '',
    })
    institution: string;

    @ManyToOne(() => OrganizationModel, {
        cascade: ['insert'],
        eager: true,
    })
    organization: Organization;

    @OneToMany(() => RatingModel, (rating: { user: any; }) => rating.user)
    ratings: RatingModel[];

    @OneToMany(() => CardCommentModel, (comment: { author: any; }) => comment.author)
    comments: CardComment[];

    @Column({
        nullable: false,
    })
    role: ROLES;

    @OneToMany(() => CardModel, (card: { author: any; }) => card.author)
    cards?: Card[];
}
