import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {OrganizationService} from './organization.service';
import {Organization} from './organization';
import {ConfirmComponent} from '../confirm/confirm.component';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
  orgs: Organization[] = [];
  loaded = false;
  searchVisible = false;
  currentPage = 1;
  term;
  @ViewChild('confirm') confirm: ConfirmComponent;

  constructor(
    private organizationService: OrganizationService
  ) { }

  ngOnInit() {
    this.getOrgs();
  }

  getOrgs() {
    this.organizationService.get().subscribe(res => {
      this.loaded = true;
      this.orgs = res;
    });
  }

  @HostListener('window:scroll')
  scrollHandler() {
    if (window.pageYOffset > 100) {
      this.searchVisible = false;
    }
  }

  showSearch() {
    this.searchVisible = true;
    window.scrollTo(0, 0);
  }

  async delete(org: Organization) {
    try {
      await this.organizationService.delete(org).toPromise();
      this.getOrgs();
    } catch (err) {
      console.error(err);
    }
  }

  async update(org: Organization) {
    try {
      await this.organizationService.update(org).toPromise();
      this.getOrgs();
    } catch (err) {
      console.error(err);
    }
  }

  deleteRequest(user: Organization) {
    this.confirm.show(user, 'delete');
  }

  handleRequest(request: {target: Organization, event: string}) {
    switch (request.event) {
      case 'delete':
        return this.deleteRequest(request.target);
      case 'update':
        return this.update(request.target);
      default:
        console.log('unknown event', event.target);
    }
  }

  handleConfirm(request: {target: Organization, event: string}) {
    switch (request.event) {
      case 'delete':
        return this.delete(request.target);
      default:
        console.log('unknown event', event.target);
    }
  }

}
