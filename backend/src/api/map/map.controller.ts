import {Get, JsonController} from 'routing-controllers';
import {SuperController} from '../../super/super.controller';
import {Map} from '../../types/map';
import {MapModel} from './map.model';
import {MapRepository} from './map.repository';

@JsonController('/map')
export class MapController extends SuperController<MapModel> {
    constructor() {
        super(new MapRepository(MapModel));
    }

    @Get()
    getAll(): Promise<Map[]> {
        return super.getAll();
    }
}
