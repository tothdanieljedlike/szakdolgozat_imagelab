import {Map} from './map';
import {HttpCrud} from '../../HttpCrud';
import {Injectable} from '@angular/core';

@Injectable()
export class MapService extends HttpCrud<Map> {
  apiUrl = '/api/map';
}
