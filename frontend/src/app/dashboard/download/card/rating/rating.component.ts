import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Rating} from './rating';
import {AuthService} from '../../../../auth/auth.service';
import {MessageService} from '../../../message.service';
declare var $: any;

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  enabled = false;
  rated = false;
  stars = 0;
  count = 0;
  @Output() rate = new EventEmitter<number>();
  currentHovered = -1;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.enabled = this.authService.isAuthenticated();
  }

  ngOnInit() {}

  @Input()
  set rating(ratings: Rating[]) {
    this.rated = false;
    let sum = 0;
    this.count = ratings.length;
    ratings.forEach(rate => {
      sum += rate.rating;
      if (this.enabled &&
          rate.user.email === this.authService.getUserData().email) {
        this.rated = true;
      }
    });
    this.stars = this.count ? sum / this.count : 0;
    setTimeout(() => $('.tooltipped.star').tooltip(), 300);
  }

  onRate(idx: number) {
    if (this.enabled) {
      this.rate.emit(idx);
    } else {
      this.messageService.add('You need to login before this action!');
    }
  }
}
