import { Injectable } from '@angular/core';
import * as Materialize from 'materialize-css';
declare var $: any;

export enum TOAST {
  LONG = 10000,
  MEDIUM = 5000,
  SHORT = 2500,
}

@Injectable()
export class MessageService {

  constructor() {}

  messages: string[] = [];

  add(message: string, length = TOAST.MEDIUM) {
    Materialize.toast(message, length);
    this.messages.push(message);
  }

  addStatic(message: string, dismiss = true) {
    let $message = $(`<span>${message}</span>`);
    if (dismiss) {
      const $button = $('<button class="btn-flat toast-action">Hide</button>');
      $button.on('click', () => {
        $message.parent().hide();
      });
      $message = $message.add($button);
    }
    return Materialize.toast($message);
  }

  updateStatic(newMessage: string, instance: any) {
    $(instance.el).find('span').html(newMessage);
  }

  removeSatic(instance: any) {
    instance.remove();
  }

  clear() {
    Materialize.Toast.removeAll();
    this.messages = [];
  }

}
