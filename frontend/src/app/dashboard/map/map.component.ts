import { Component, OnInit } from '@angular/core';
import {Map} from './map';
import {MapService} from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  maps: Map[] = [];
  constructor(
    private mapService: MapService
  ) {
    mapService.get().toPromise()
      .then(res => this.maps = res)
      .catch(err => console.error('MAPS', err));
  }

  ngOnInit() {
  }

}
