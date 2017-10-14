import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {RunwayDirection} from "./runwayDirection";
import {RunwayDirectionPosition} from "./runwayDirectionPosition";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {DirectionCatalogService} from "./direction-catalog.service";
import {DirectionService} from "./direction.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiError} from "../main/apiError";


@Component({
  template: `
    <h1 i18n="@@runwayDirection.new.title">
      New runway direction
    </h1>
    <p i18n="@@runwayDirection.new.main_description">
      This section allows users to create a runway direction.
    </p>
    <hr/>

    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@runwayDirection.detail.section.general.title">
            General
          </h3>
        </div>
        <div class="panel-body" [ngSwitch]="status">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
            <app-error-indicator [error]="onInitError"></app-error-indicator>
          </div>
          <form #generalForm="ngForm" 
                *ngSwitchCase="indicator.ACTIVE"
                role="form" 
                class="form container-fluid" 
                (ngSubmit)="onSubmit()">

            <app-error-indicator [error]="onSubmitError" *ngIf="onSubmitError"></app-error-indicator>
            
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="number"
                  class="control-label"
                  i18n="@@direction.detail.section.general.number">
                  Number
                </label>
                <input
                  type="number"
                  class="form-control"
                  name="quantity"
                  min="1"
                  max="36"
                  length="2"
                  [(ngModel)]="direction.number"
                  required>
              </div>
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="position"
                  class="control-label"
                  i18n="@@direction.detail.section.general.position">
                  Position
                </label>
                <select
                  name="inputSurface"
                  [(ngModel)]="direction.position"
                  class="form-control"
                  required>
                  <option *ngFor="let position of positions" [value]="position.id">
                    {{position.description}}
                  </option>
                </select>
              </div>
            </div>          
          </form>
        </div>
      </div>

      <br>

      <hr>

      <div class="row">
        <div class="pull-right">
          <button
            type="button"
            (click)="onCancel()"
            class="btn btn-default"
            i18n="@@commons.button.cancel">
            Cancel
          </button>
          <button
            type="button"
            (click)="generalForm.ngSubmit.emit()"
            [disabled]="generalForm.form.invalid"
            class="btn btn-success"
            i18n="@@commons.button.create">
            Create
          </button>
        </div>
      </div>

    </div>
    `
})

export class DirectionNewComponent implements OnInit {

  status: number;
  indicator;
  airportId : number;
  runwayId : number;
  direction: RunwayDirection;
  positions : RunwayDirectionPosition[];
  onSubmitError: ApiError;
  onInitError: ApiError;

  constructor(
    private router : Router,
    private route : ActivatedRoute,
    private directionService : DirectionService,
    private catalogService : DirectionCatalogService
  ){
    this.direction = new RunwayDirection();
    this.positions = [];
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.airportId = +this.route.parent.parent.snapshot.params['airportId'];

    this.runwayId = +this.route.parent.snapshot.params['runwayId'];

    this.direction.runwayId = this.runwayId;

    this.status = STATUS_INDICATOR.LOADING;

    this.catalogService
      .listPositions()
      .then(data => {
        this.positions = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error =>{
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });

  }

  onSubmit(){

    this.onSubmitError = null;

    this.directionService
      .save(this.airportId, this.runwayId, this.direction)
      .then( (data) => this.router.navigate([`/airports/${this.airportId}/runways/${this.runwayId}/directions/${data.id}/detail`]) )
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    this.router.navigate([`/airports/${this.airportId}/runways/${this.runwayId}/detail`])
  };

}