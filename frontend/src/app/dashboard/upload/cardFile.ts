import {User} from '../users/user';

export class CardFile {
  name: string;
  description: string;
  files: FileList;
  creator: User;
}
