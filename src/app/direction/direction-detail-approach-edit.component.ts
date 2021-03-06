import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {RunwayApproachSection} from "./runwayApproachSection";
import {DirectionService} from "./direction.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {DirectionDistancesService} from "./direction-distances.service";
import {ApiError} from "../main/apiError";

@Component({
  selector: 'app-direction-approach-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@direction.detail.section.approach.title">
            Approach Section
          </h3>
        </div>
      </div>
      <div class="panel-body" [ngSwitch]="status">
        
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <form #approachSectionForm="ngForm" 
              *ngSwitchCase="indicator.ACTIVE" 
              role="form" 
              class="form container-fluid" 
              (ngSubmit)="onSubmit()">

          <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>
          
          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label"
                     for="inputEnabled"
                     i18n="@@direction.detail.section.approach.enabled">
                Enabled
              </label>
              <input type="checkbox"
                     name="inputEnabled"
                     [(ngModel)]="section.enabled"
              >
            </div>
          </div>

          <div class="row">
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" 
                     for="inputThresholdLength"
                     i18n="@@direction.detail.section.approach.thresholdLength">
                Threshold length
              </label>
              <div class="input-group">
                <input
                  type="number"
                  min="0"
                  max="99"
                  step="1"
                  name="inputThresholdLength"
                  [(ngModel)]="section.thresholdLength"
                  class="form-control"
                  placeholder="00.0"
                  required>
                <div class="input-group-addon">[m]</div>
              </div>
            </div>
            <div class="col-md-6 col-sm-12 form-group">
              <label class="control-label" 
                     for="inputThresholdElevation"
                     i18n="@@direction.detail.section.approach.thresholdElevation">
                Threshold elevation
              </label>
              <div class="input-group">
                <input
                  type="number"
                  min="0"
                  max="99"
                  step="1"
                  name="inputThresholdElevation"
                  [(ngModel)]="section.thresholdElevation"
                  class="form-control"
                  placeholder="00.0"
                  required>
                <div class="input-group-addon">[m]</div>
              </div>
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
                [disabled]="approachSectionForm.invalid"
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

export class DirectionDetailApproachEditComponent implements OnInit {

  @Input() airportId: number;
  @Input() runwayId: number;
  @Input() directionId: number;
  indicator;
  status: number;
  section: RunwayApproachSection;
  @Input() edit: boolean;
  @Output() editChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  private updates : number = 0;
  onInitError: ApiError;
  onSubmitError: ApiError;

  constructor(
    private directionService: DirectionService,
    private distancesService: DirectionDistancesService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.directionService
      .getApproachSection(this.airportId, this.runwayId, this.directionId)
      .then(data => {
        this.section = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  onSubmit() : void {

    this.onSubmitError = null;

    this.directionService
      .updateApproachSection(this.airportId, this.runwayId, this.directionId, this.section)
      .then(()=> {
            this.disallowEdition();
            this.distancesService.updateLength(this.updates++)
      })
      .catch(error => this.onSubmitError = error);
  }

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
