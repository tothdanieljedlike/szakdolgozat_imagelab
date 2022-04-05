import {Injectable} from '@angular/core';
import {HttpCrud} from '../../HttpCrud';
import {Organization} from './organization';

@Injectable()
export class OrganizationService extends HttpCrud<Organization> {
  apiUrl = '/api/organization';
}
