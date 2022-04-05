import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MaterializeAction} from 'angular2-materialize';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  obj: {};
  event: string;
  title = 'Are you sure?';
  description = '';
  sent = false;
  @Output()
  @Input()
  confirm: EventEmitter<{target: {}, event: string}> = new EventEmitter<{target: {}, event: string}>();

  modalActions = new EventEmitter<string|MaterializeAction>();

  constructor() {}

  ngOnInit() {
  }

  showModal() {
    this.modalActions.emit({action: 'modal', params: ['open']});
  }

  accept() {
    if (!this.sent) {
      this.sent = true;
      this.confirm.emit({
        target: this.obj,
        event: this.event,
      });
    }
  }

  public show(target: {}, event?: string, title?: string, description?: string) {
    this.sent = false;
    this.obj = target;
    this.event = event;
    if (title) { this.title = title; }
    if (description) { this.description = description; }
    this.showModal();
  }

}
