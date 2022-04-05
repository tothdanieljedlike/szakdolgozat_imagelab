import {HttpCrud} from '../../../HttpCrud';
import {Injectable} from '@angular/core';
import {Card} from './card';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {fileProgressLogger, getEventMessage} from '../../../HttpDownload';
import {HttpEvent, HttpRequest} from '@angular/common/http';

@Injectable()
export class CardService extends HttpCrud<Card> {
  apiUrl = '/api/card';

  addFile(data: FormData, name: string): Observable<Card> {
    const toast = this.messageService.addStatic(`Uploading ${name}...`);
    return this.http.request(new HttpRequest('POST', this.url, data, {
      reportProgress: true,
    })).pipe(
      map((event: HttpEvent<any>) => getEventMessage(event, name)),
      tap(fileProgressLogger(this.messageService, toast, name)),
      catchError(this.handleError<Card>('add')));
  }
}
