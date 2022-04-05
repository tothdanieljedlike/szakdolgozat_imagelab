import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Card} from '../card/card';
import {Comment} from '../card/comment';
import {MaterializeAction} from 'angular2-materialize';
import {} from '@types/googlemaps';
import {CommentService} from '../card/comment.service';
import {AuthService} from '../../../auth/auth.service';
import {animatedScrollByElement} from '../../../utils/scroll';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  map: google.maps.Map;
  myID: number;
  isTop = true;
  @ViewChild('map') nativeMap;
  card: Card;
  comments: Comment[] = [];
  modalActions = new EventEmitter<string|MaterializeAction>();
  comment = '';
  @ViewChild('commentBox') commentsEl: ElementRef;
  @ViewChild('content') contentEl: ElementRef;
  @Output() downloadRequest = new EventEmitter<Card>();

  constructor(
    private commentService: CommentService,
    authService: AuthService,
  ) {
    if (authService.isAuthenticated()) {
      this.myID = authService.getUserData().id;
    }
  }

  ngOnInit() {}

  @Input()
  set cardRequest(event: EventEmitter<Card>) {
    if (event) {
      event.subscribe(card => {
        if (this.card !== card) {
          this.card = card;
          this.modalActions = new EventEmitter<string|MaterializeAction>();
          if (this.map) {
            this.storeMapReady();
          }
        } else {
          this.show();
        }
        return this.getComments();
      });
    }
  }

  onScroll(event: Event) {
    this.isTop = event.srcElement.scrollTop === 0;
  }

  scrollToComments() {
    animatedScrollByElement(this.contentEl.nativeElement, this.commentsEl.nativeElement.offsetTop);
  }

  storeMapReady(map?: google.maps.Map) {
    if (map) {
      this.map = map;
    }
    this.modalActions.emit({action: 'modal', params: [{
        'ready': async () => {
          await this.nativeMap.triggerResize(false);
          this.setMapToCenter();
        }
      }]});
    setTimeout(() => {
      this.show();
    }, 100);
  }

  setMapToCenter() {
    this.map.fitBounds(this.findBounds());
  }

  findBounds() {
    const bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds();

    for (const map of this.card.maps) {
      bounds.extend(new google.maps.LatLng(map.lat, map.lng));
    }

    return bounds;
  }

  show() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  close() {
    this.modalActions.emit({action: 'modal', params: ['close']});
  }

  async getComments() {
    try {
      this.comments = await this.commentService.getByCardId(this.card.id).toPromise();
    } catch (err) {
      console.error(err);
    }
  }

  async sendComment(event: Event) {
    event.preventDefault();

    try {
      await this.commentService.add({
        id: null,
        card: this.card,
        author: null,
        text: this.comment,
        date: null
      }).toPromise();
    } catch (err) {
      console.error(err);
    }
    this.comment = '';
    return this.getComments();
  }

  async deleteComment(comment: Comment) {
    try {
      await this.commentService.delete(comment).toPromise();
    } catch (err) {
      console.error(err);
    }
    return this.getComments();
  }
}


