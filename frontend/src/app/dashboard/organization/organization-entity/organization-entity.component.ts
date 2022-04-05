import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Organization} from '../organization';
import * as Materialize from 'materialize-css';

@Component({
  selector: 'app-organization-entity',
  templateUrl: './organization-entity.component.html',
  styleUrls: ['./organization-entity.component.scss']
})
export class OrganizationEntityComponent implements OnInit {
  editing = false;
  tmpOrg: Organization;
  @Input()
  org: Organization;
  @Output()
  @Input()
  modifyRequest = new EventEmitter<{target: Organization, event: string}>();

  constructor() { }

  ngOnInit() {
  }

  startEdit() {
    this.editing = true;
    this.tmpOrg = Object.assign({}, this.org);
    setTimeout(Materialize.updateTextFields, 100);
  }

  stopEdit() {
    this.editing = false;
    this.modifyRequest.emit({target: this.tmpOrg, event: 'update'});
    // this.org = this.tmpOrg;
  }

}
