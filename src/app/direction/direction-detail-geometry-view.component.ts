import {
  AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import Point = ol.geom.Point;
import Map = ol.Map;
import {OlComponent} from "../olmap/ol.component";
import {DirectionService} from "./direction.service";
import {ApiError} from "../main/apiError";
import Polygon = ol.geom.Polygon;

@Component({
  selector: 'app-direction-geometry-view',
  providers: [ OlComponent ],
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.spatial.title">
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
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE">
          <div class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputGeoJSON" class="control-label" i18n="@@direction.detail.section.spatial.inputGeoJSON">
                  Point
                </label>
                <p class="form-control-static">{{geomText}}</p>
              </div>
            </div>
          </div>
          <br>
          <app-map #mapDirection (map)="map"></app-map>
        </div>
        
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="definition" entity="point"></app-empty-indicator>
        </div>
      </div>
      
    </div>
  `
})

export class DirectionDetailGeometryViewComponent implements OnInit, AfterViewInit{

  @Input() airportId : number;
  @Input() runwayId : number;
  @Input() directionId : number;
  map: Map;
  private olmap: OlComponent;
  onInitError: ApiError;
  @ViewChild('mapDirection') set content(content: OlComponent) {
    this.olmap = content;
  }
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  geom  : Point;
  geomText : string;
  thresholdGeom : Polygon;

  constructor(
    private directionService : DirectionService
  ){
    this.geom = null;
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.status = STATUS_INDICATOR.LOADING;
    this.geom = null;
    this.onInitError = null;

    this.directionService
      .getGeom(this.airportId, this.runwayId, this.directionId)
      .then(point => {

        if(!point){
          this.status = STATUS_INDICATOR.EMPTY;
        } else {
          this.geom = point;
          this.geomText = JSON.stringify(point);
        }

        return point;
      })
      .catch(error => this.status = STATUS_INDICATOR.ERROR)
      .then(point => {

        if(point != null)
          return this.directionService
            .getDisplacedThresholdGeom(this.airportId, this.runwayId, this.directionId)
        else
          return null;

      })
      .catch(error => Promise.reject(error))
      .then(polygon => {
        if(polygon != null){
          this.thresholdGeom = polygon;
          this.status = STATUS_INDICATOR.ACTIVE;
        }
      })
  }

  ngAfterViewInit(): void {
    setTimeout(()=> this.locateGeom(),1500);
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  locateGeom(){
      this.olmap.addDirection(this.geom, {center: true, zoom: 15});
      this.olmap.addThreshold(this.thresholdGeom);
  }
}
