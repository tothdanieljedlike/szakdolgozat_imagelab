import {SuperRepository} from '../../super/super.repository';
import {Card} from '../../types/card';
import {User} from '../../types/user';
import {RatingModel} from './rating.model';

export class RatingRepository extends SuperRepository<RatingModel> {
    getByUserAndCard(user: User, card: Card) {
        return this.repository.createQueryBuilder('rating')
            .where('cardId = :cardID', {cardID: card.id})
            .andWhere('userId = :userID', {userID: user.id})
            .getOne();
    }
}
