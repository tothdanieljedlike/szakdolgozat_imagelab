import {SuperRepository} from '../../super/super.repository';
import {MapModel} from './map.model';

export class MapRepository extends SuperRepository<MapModel> {
    getAll() {
        return this.repository.createQueryBuilder('map')
            .leftJoin('map.card', 'card')
            .select([
                'map',
                'card.id',
            ])
            .getMany();
    }
}
