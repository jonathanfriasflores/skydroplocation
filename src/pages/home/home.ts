import { Component } from '@angular/core';
import { MapComponent } from '../../components/map/map';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  entryComponents: [MapComponent]

})
export class HomePage {

  public id;
  constructor() {

  }

}
