import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Card} from './card';
import {DownloadListService} from '../download-list.service';
import {ConfirmComponent} from '../../confirm/confirm.component';
import * as Materialize from 'materialize-css';
import {RatingService} from './rating/rating.service';
import {CardService} from './card.service';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})

export class CardComponent implements OnInit {
  editing = false;
  tmpCard: Card;
  @Input() card: Card;
  @Input() editable = false;
  @Output() modelRequest = new EventEmitter<Card>();
  @Output() delete = new EventEmitter<{
    target: Card,
    event: string
  }>();
  sliderActions = new EventEmitter<string|MaterializeAction>();
  @ViewChild('confirm') confirm: ConfirmComponent;

  constructor(
    private cardService: CardService,
    private downloadList: DownloadListService,
    private ratingService: RatingService) { }

  ngOnInit() {}

  async getCard() {
    try {
      const card = await this.cardService.getById(this.card.id).toPromise();
      if (card) {
        this.card = card;
        this.sliderActions.emit('slider');
      }
    } catch (err) {
      console.error(err);
    }
  }

  isInDownloadList() {
    return this.downloadList.contains(this.card);
  }

  addToDownloadList() {
    if (!this.isInDownloadList()) {
      this.downloadList.add(this.card);
    } else {
      this.removeFromDownloadList();
    }
  }

  deleteRequest(card: Card) {
    this.confirm.show(card, 'delete');
  }

  removeFromDownloadList() {
    this.downloadList.remove(this.card);
  }

  addRate(rating: number) {
    this.ratingService.add({
      id: null,
      card: this.card,
      user: null,
      rating,
    }, 'rated').subscribe(() => this.getCard());
  }

  startEdit() {
    this.editing = true;
    this.tmpCard = Object.assign({}, this.card);
    setTimeout(Materialize.updateTextFields, 100);
  }

  stopEdit() {
    this.editing = false;
    this.cardService.update(this.tmpCard).subscribe(() => this.getCard());
  }
}
