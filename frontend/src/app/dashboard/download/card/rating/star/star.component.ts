import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.css']
})
export class StarComponent implements OnInit {
  @Input() rated: boolean;
  @Input() rate: number;
  @Input() current: number;
  @Input() hovered: boolean;
  @Input() enabled: boolean;
  constructor() { }

  ngOnInit() {
  }
  get rating() {
    return this.rate / this.current;
  }
  trunc(number: number) {
    return Math.trunc(number);
  }

  get halfValue() {
    return this.rate % this.trunc(this.current - 1);
  }

}
