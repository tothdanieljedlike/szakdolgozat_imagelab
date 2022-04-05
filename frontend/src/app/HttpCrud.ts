import {Inject, Injectable} from '@angular/core';
import {MessageService} from './dashboard/message.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {catchError, tap} from 'rxjs/operators';
import {of} from 'rxjs/observable/of';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export abstract class HttpCrud<T extends {id: number}> {
  protected apiUrl: string;

  get url() {
    return this.origin + this.apiUrl;
  }

  constructor(
    @Inject('origin') protected origin: string,
    protected http: HttpClient,
    protected messageService: MessageService) {}

  get (additionalUrl = ''): Observable<T[]> {
    return this.http.get<T[]>(this.url + additionalUrl)
      .pipe(
        catchError(this.handleError('get', []))
      );
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/id/${id}`)
      .pipe(catchError(this.handleError('get', null)));
  }

  add (item: T, successText = 'added'): Observable<T> {
    return this.http.post<T>(this.url, item, httpOptions).pipe(
      tap(() => this.log(successText)),
      catchError(this.handleError<T>('add'))
    );
  }

  delete (item: T, successText = 'deleted'): Observable<T> {
    return this.http.delete<T>(`${this.url}/id/${item.id}`, httpOptions).pipe(
      tap(() => this.log(successText)),
      catchError(this.handleError<T>('delete'))
    );
  }

  update (item: T, successText = 'updated'): Observable<any> {
    return this.http.put(`${this.url}/id/${item.id}`, item, httpOptions).pipe(
      tap(() => this.log(successText)),
      catchError(this.handleError<any>('update'))
    );
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

      const message = error.error ? error.error.message ? error.error.message : error.error : error.message;

      this.log(`${operation} failed: ${message}`);

      // Let the app keep running by returning an empty result.
      return of(result as _T);
    };
  }

  protected log(message: string) {
    this.messageService.add(message);
  }
}
