import {Component, EventEmitter, OnInit, HostListener} from '@angular/core';
import {CardService} from './card/card.service';
import {Card} from './card/card';
import {DownloadListService} from './download-list.service';
import {MessageService} from '../message.service';
import {ActivatedRoute} from '@angular/router';
import {RoleGuardService} from '../../auth/role-guard.service';
import {animatedScrollByElement, animatedScrollByWindow} from '../../utils/scroll';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  currentPage = 1;
  cards: Card[] = [];
  searchVisible = false;
  loaded = false;
  term;
  cardChanged: EventEmitter<Card> = new EventEmitter<Card>();

  constructor(
    private route: ActivatedRoute,
    private roleService: RoleGuardService,
    private messageService: MessageService,
    private cardService: CardService,
    protected downloadList: DownloadListService) {
      this.getCards();
  }

  ngOnInit() { }

  @HostListener('window:scroll')
  scrollHandler() {
    if (window.pageYOffset > 100) {
      this.searchVisible = false;
    }
  }

  showSearch() {
    animatedScrollByWindow(0, () => {
      this.searchVisible = true;
    });
  }

  canModify(card: Card) {
    return this.roleService.canModify(card.author.email);
  }

  getCards() {
    this.cardService.get()
      .subscribe(cards => {
        this.cards = cards;

        this.route.params.subscribe(params => {
          const id = +params['id'];
          if (!this.loaded && id) {
            this.loaded = true;
            for (const card of this.cards) {
              if (card.id === id) {
                return this.cardChanged.emit(card);
              }
            }
            this.messageService.add('card not found');
          } else {
            this.loaded = true;
          }
        });
      });
  }

  async deleteCard(card: Card) {
    try {
      const resCard = await this.cardService.delete(card).toPromise();
      if (resCard) {
        this.cards.forEach((arrCard, idx) => {
          if (arrCard.id === card.id) {
            this.cards.splice(idx, 1);
          }
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  downloadAll(): void {
    this.downloadList.downloadAll();
  }

  downloadOne(card: Card) {
    this.downloadList.download(card);
  }

  showDownloadList() {
    this.messageService.add(this.downloadList.names.join('<br>'));
  }

  clearDownloadList() {
    this.downloadList.clear();
  }

  get isDownloadListEmpty() {
    return !this.downloadList.length;
  }

  handleDeleteRequest(request: {target: Card; event: string}) {
      return this.deleteCard(request.target);
  }
}
