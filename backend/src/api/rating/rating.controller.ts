import {Authorized, Body, CurrentUser, JsonController, Post} from 'routing-controllers';
import {SuperController} from '../../super/super.controller';
import {Rating} from '../../types/rating';
import {User} from '../../types/user';
import {RatingModel} from './rating.model';
import {RatingRepository} from './rating.repository';

@JsonController('/rating')
export class RatingController extends SuperController<RatingModel> {
    constructor() {
        super(new RatingRepository(RatingModel));
    }

    @Post()
    @Authorized()
    async add(
        @Body({required: true}) item: Rating,
        @CurrentUser() user: User): Promise<RatingModel> {

        item.user = user;
        const target = await (this.repository as RatingRepository).getByUserAndCard(item.user, item.card);
        if (!target) {
            return super.add(item as RatingModel);
        }
        item.id = target.id;
        return super.update(item.id, item as RatingModel);
    }
}
