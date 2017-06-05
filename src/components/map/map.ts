import { Component, OnInit } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
/**
 * Generated class for the MapComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
 declare var google

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent implements OnInit{

  public map;
  public marker: any;
  private cLocation: any;

  constructor(public http: Http) {
  }
  ngOnInit(){
  	  	this.map = this.createMap();
        this.getCurrentLocation().subscribe(location => {
          this.centerLocation(location);
        });
  }


  getCurrentLocation(){

    let options = {timeout: 2000, enableHighAccuracy: true, maximumAge:60000};

    let locationObs = Observable.create(observable => {
      Geolocation.getCurrentPosition(options)
    .then(resp => {
      let lat = resp.coords.latitude;
      let lng = resp.coords.longitude;
      this.cLocation = new google.maps.LatLng(lat, lng);

      observable.next(this.cLocation);
    },
    (err) => {
      console.log('Geo error'+err);
      alert("Could not find location, try again");


    })
    })
    return locationObs;
    
  }

  centerLocation(location){
    if(location){
      this.map.panTo(location);
      this.markLocation(location);
    }
    else{
      alert("Finding location");
      this.getCurrentLocation().subscribe(currentLocation => {
        this.map.panTo(currentLocation);
        this.markLocation(currentLocation);

      })
    }
  }

  markLocation(location){
   /* this.marker.setMap(null)
    this.marker = new google.maps.Marker({
          position: location        
        });
  this.marker.setMap(this.map);
*/  
    if(this.marker){
      this.marker.setMap(null);
    }
    //this.map.clear();
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map/*,
      icon: '../../assets/icon/bluecircle.png'*/
    });
    return true;
  }

  submitInfo(id){

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = { ubicacion: this.cLocation };
  
    this.http.put ('https://shrouded-woodland-11800.herokuapp.com/api/usuarios/'+id, JSON.stringify(body),{headers: headers})
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
        alert("informacion enviada");
    });
  }

  

  createMap(location = new google.maps.LatLng(24,-101)){
  	let mapOptions = {
      center: location,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false
  	}
  	let mapElement = document.getElementById('map');
  	let map = new google.maps.Map(mapElement, mapOptions);
  	return map
  }


}
