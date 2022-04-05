import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  @Input() appAutofocus: string;

  constructor(private el: ElementRef) {}

  parseValue() {
    return this.appAutofocus === '' || this.appAutofocus === 'true';
  }

  ngAfterViewInit() {
    if (this.parseValue()) {
      this.el.nativeElement.focus();
    }
  }

}
