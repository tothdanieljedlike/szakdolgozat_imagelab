import { Injectable } from '@angular/core';
import {Card} from './card/card';
import {HttpDownload} from '../../HttpDownload';
import * as FileSaver from 'file-saver';

@Injectable()
export class DownloadListService {
  private list: {[id: number]: Card} = {};

  constructor(
    private downladManager: HttpDownload) { }

  contains(card: Card): boolean {
    return !!this.list[card.id];
  }

  add(card: Card): void {
    // this.messageService.add('Added to download list');
    this.list[card.id] = card;
  }

  remove(card: Card): void {
    // this.messageService.add('Removed from download list');
    delete this.list[card.id];
  }

  download(card: Card) {
      const splittedURL = card.downloadLink.split('/');
      this.downladManager
        .get(card.downloadLink, card.name)
        .subscribe((content: Blob) => {
          FileSaver.saveAs(content, card.name + '-' + splittedURL[splittedURL.length - 1]);
        });
  }

  downloadAll() {
      this.keys.forEach(id => {
        const current: Card = this.list[id];
        if (current) {
          this.download(current);
        }
      });
  }

  get keys(): string[] {
    return Object.keys(this.list);
  }

  get names(): string[] {
    return this.keys.map(key => this.list[key].name);
  }

  get length(): number {
    return this.keys.length;
  }

  clear() {
    this.list = {};
  }
}
