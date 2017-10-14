import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import Point = ol.geom.Point;
import {DirectionService} from "./direction.service";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";

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
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <form  #geometryForm="ngForm"
               *ngSwitchCase="indicator.ACTIVE"
               role="form" 
               class="form container-fluid" 
               (ngSubmit)="onSubmit()">

          <app-error-indicator [error]="onSubmitError" *ngIf="onSubmitError"></app-error-indicator>
          
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputGeoJSON" class="control-label" i18n="@@direction.detail.section.spatial.inputGeoJSON">
                Point
              </label>
              <textarea
                name="inputGeoJSON"
                [(ngModel)]="geomText"
                class="form-control"
                placeholder='{ "type": "Point", "coordinates": [0.0, 0.0] }'
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
  geomText : string;
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

    this.status = STATUS_INDICATOR.LOADING;

    this.directionService
      .getGeom(this.airportId, this.runwayId, this.directionId)
      .then( data => {
        this.geomText = JSON.stringify(data);
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch( error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){

    this.onSubmitError = null;

    let point : Point = JSON.parse(this.geomText) as Point;

    this.directionService
      .saveGeom(this.airportId, this.runwayId, this.directionId, point)
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
