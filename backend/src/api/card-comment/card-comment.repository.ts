import {SuperRepository} from '../../super/super.repository';
import {CardCommentModel} from './card-comment.model';

export class CardCommentRepository extends SuperRepository<CardCommentModel> {
    getByCardId(id: number) {
        return this.repository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.card', 'card')
            .leftJoinAndSelect('comment.author', 'user')
            .select()
            .where('comment.card = :id', {id})
            .getMany();
    }
}
