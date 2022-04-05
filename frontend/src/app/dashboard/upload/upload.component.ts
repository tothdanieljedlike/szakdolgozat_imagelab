import {Component, OnInit, ViewChild} from '@angular/core';
import {CardFile} from './cardFile';
import {CardService} from '../download/card/card.service';
import {RecaptchaComponent} from 'ng-recaptcha';
import {Router} from '@angular/router';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  file: CardFile = {name: '', description: '', files: null, creator: null};
  reCaptcha: string;
  uploading = false;
  @ViewChild('captcha') captchaElement: RecaptchaComponent;
  @ViewChild('submit') submit: HTMLInputElement;

  constructor(
    private cardService: CardService,
    private messageService: MessageService,
    private router: Router) { }

  ngOnInit() { }

  isZipPresent() {
    return this.file.files && this.file.files.length;
  }

  isValid(showError = false) {
    if (!this.isZipPresent()) {
      if (showError) {
        this.messageService.add('missing zip');
      }
      return false;
    }
    if (!this.reCaptcha) {
      if (showError) {
        this.messageService.add('invalid ReCaptcha');
      }
      return false;
    }
    return true;
  }

  async upload(event) {
    event.preventDefault();

    if (!this.isValid(true)) {
      return;
    }

    this.uploading = true;

    const zip: File = this.file.files[0];

    const formData = new FormData();
    formData.append('name', this.file.name);
    formData.append('description', this.file.description);
    formData.append('export', zip);
    formData.append('g-recaptcha-response', this.reCaptcha);

    try {
      const response = await this.cardService.addFile(formData, this.file.name || zip.name).toPromise();

      if (!response) {
        return this.captchaElement.reset();
      }
      this.router.navigate(['/download', response.id]);
    } catch (err) {
      this.captchaElement.reset();
    }

    this.uploading = false;
  }
}
