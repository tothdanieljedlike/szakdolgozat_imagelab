import {Organization} from '../organization/organization';

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  organization: Organization;
}
