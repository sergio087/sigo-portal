import {
  AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {AirportService} from "./airport.service";
import Point = ol.geom.Point;
import Map = ol.Map;
import {OlComponent} from "../olmap/ol.component";
import {ApiError} from "../main/apiError";
import Feature = ol.Feature;
import GeoJSONFeature = ol.format.GeoJSONFeature;
import JSONFeature = ol.format.JSONFeature;
import Coordinate = ol.Coordinate;
import GeoJSON = ol.format.GeoJSON;

@Component({
  selector: 'app-airport-geometry-view',
  providers: [ OlComponent ],
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@airport.detail.section.spatial.title">
            Spatial
          </h3>
          <div class="col-md-6 btn-group">
            <a
              (click)="allowEdition();"
              class="btn btn-default pull-right"
              i18n="@@commons.button.edit">
              Edit
            </a>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>

      <div [ngSwitch]="status" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING" class="container-fluid">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="definition" entity="point"></app-empty-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE">
          <div class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputGeoJSON" class="control-label"
                       i18n="@@airport.detail.section.spatial.inputCoordinates">
                  Point
                </label>
                <p class="form-control-static">{{coordinateText}}</p>
              </div>
            </div>
          </div>
          <br>
          <app-map #mapAirport (map)="map"></app-map>
        </div>
      </div>

    </div>
  `
})

export class AirportDetailGeometryViewComponent implements OnInit, AfterViewInit{

  @Input() airportId : number;
  map: Map;
  private olmap: OlComponent;
  onInitError :ApiError;

  @ViewChild('mapAirport') set content(content: OlComponent) {
    this.olmap = content;
  }
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  feature  : Feature;
  coordinateText : string;

  constructor(
    private airportService : AirportService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = STATUS_INDICATOR.LOADING;

    this.airportService
      .getFeature(this.airportId)
      .then(data => {

        if(!data){
          this.status = STATUS_INDICATOR.EMPTY;

        } else {
          this.feature = data;
          let jsonFeature = JSON.parse(new GeoJSON().writeFeature(data));
          this.coordinateText = JSON.stringify(jsonFeature.geometry.coordinates);
          this.status = STATUS_INDICATOR.ACTIVE;
        }
      })
      .catch(error => {
        this.onInitError = error;
        console.error(error);
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  ngAfterViewInit(): void {
      setTimeout(()=> {if (this.feature != null) this.locateGeom(); },1500);
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  locateGeom(){

    this.olmap.addAirport(this.feature,{center: true, zoom: 12});
  }
}
