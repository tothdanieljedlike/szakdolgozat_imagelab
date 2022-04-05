import {Inject, Injectable} from '@angular/core';
import {MessageService} from './dashboard/message.service';
import {HttpClient, HttpEvent, HttpEventType, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {last, map, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

export function getEventMessage(event: HttpEvent<any>, name: string) {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      const uploadPrecent = Math.round(100 * event.loaded / event.total);
      return `File "${name}" is ${uploadPrecent}% uploaded.`;
    case HttpEventType.DownloadProgress:
      const downloadPercent = Math.round(100 * event.loaded / event.total);
      return `File "${name}" is ${downloadPercent}% downloaded.`;
    case HttpEventType.Response:
      return event.body;
  }
}

export function fileProgressLogger(messageService: MessageService, toastInstance: any, objName: string) {
  const logger = messageService;
  const toast = toastInstance;
  const name = objName;
  return (message) => {
    if (typeof message === 'string') {
      logger.updateStatic(message, toast);
    } else if (typeof message === 'object') {
      logger.updateStatic(`${name} is finished`, toast);
      setTimeout(() => {
        logger.removeSatic(toast);
      }, 2000);
    }
  };
}

@Injectable()
export class HttpDownload {
  constructor(
    @Inject('origin') protected origin: string,
    protected http: HttpClient,
    private messageService: MessageService) {}

  get (url: string, name: string): Observable<Blob> {
    const toast = this.messageService.addStatic(`Downloading ${name}...`);
    return this.http.request(this.makeRequest(this.origin + url)).pipe(
      map((event: HttpEvent<any>) => getEventMessage(event, name)),
      tap(fileProgressLogger(this.messageService, toast, name)),
      last());
  }

  makeRequest(url: string) {
    return new HttpRequest('GET', url, {
      reportProgress: true,
      responseType: 'blob'
    });
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<_T> (operation = 'operation', result?: _T) {
    return (error: any): Observable<_T> => {
      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as _T);
    };
  }

  protected log(message: string) {
    this.messageService.add('CardService: ' + message);
  }
}
