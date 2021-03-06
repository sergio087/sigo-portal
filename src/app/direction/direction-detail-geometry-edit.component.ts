import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import Point = ol.geom.Point;
import {DirectionService} from "./direction.service";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import GeoJSON = ol.format.GeoJSON;
import Feature = ol.Feature;

@Component({
  selector: 'app-direction-geometry-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.spatial.title">
            Spatial
          </h3>
          <div class="clearfix"></div>
        </div>
      </div>

      <div class="panel-body" [ngSwitch]="status">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <form  #geometryForm="ngForm"
               *ngSwitchCase="indicator.ACTIVE"
               role="form" 
               class="form container-fluid" 
               (ngSubmit)="onSubmit()">

          <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>
          
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputGeoJSON" class="control-label" i18n="@@direction.detail.section.spatial.inputGeoJSON">
                Point
              </label>
              <textarea
                name="inputGeoJSON"
                [(ngModel)]="coordinatesText"
                class="form-control"
                placeholder='[0.0, 0.0]'
                rows="3"
                required>
              </textarea>
            </div>
          </div>
          <hr>
          <div class="row">
            <div class="pull-right">
              <button
                (click)="onCancel()"
                type="button"
                class="btn btn-default"
                i18n="@@commons.button.cancel">
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="geometryForm.invalid"
                class="btn btn-success"
                i18n="@@commons.button.save">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `
})

export class DirectionDetailGeometryEditComponent implements OnInit{
  coordinatesText : string;
  feature:Feature;
  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  status: number;
  onSubmitError: ApiError;
  onInitError: ApiError;
  indicator;

  constructor(
    private directionService : DirectionService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;
    this.coordinatesText = '';
    this.status = STATUS_INDICATOR.LOADING;

    this.directionService
      .getFeature(this.airportId, this.runwayId, this.directionId)
      .then( data => {
        this.feature = data;
        if(data.getGeometry()){
          let jsonFeature = JSON.parse(new GeoJSON().writeFeature(data));
          this.coordinatesText = JSON.stringify(jsonFeature.geometry.coordinates);
        }
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch( error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){

    this.onSubmitError = null;

    let point : Point = new Point(JSON.parse(this.coordinatesText));

    this.directionService
      .updateFeature(this.airportId, this.runwayId, this.directionId, point)
      .then( () => this.disallowEdition() )
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
