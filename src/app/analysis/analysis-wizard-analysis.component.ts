import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {BlockTemplateComponent} from "../commons/block-template.component";
import {BlockUI, NgBlockUI} from "ng-block-ui";
import {AppError} from "../main/ierror";
import {ApiError} from "../main/apiError";
import {ActivatedRoute, Router} from "@angular/router";
import {AnalysisWizardService} from "./analysis-wizard.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {OlComponent} from "../olmap/ol.component";
import Map = ol.Map;
import {DirectionService} from "../direction/direction.service";
import {RunwayService} from "../runway/runway.service";
import {AnalysisService} from "./analysis.service";
import {Runway} from "../runway/runway";
import {Analysis} from "./analysis";
import {RunwayDirection} from "../direction/runwayDirection";

@Component({
  template:`
    <h1>
      <ng-container i18n="@@analysis.wizard.object.title">Analysis: Analyze obstacles </ng-container>
      <small class="pull-right">Stage 3/4</small>
    </h1>
    <p i18n="@@wizard.object.main_description">
      This section allows users to analyze the obstacles detected as a result of the application of the regulation.
    </p>

    <hr/>

    <div *ngIf="onSubmitError">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>

    <block-ui [template]="blockTemplate" [delayStop]="500">
      
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row">
            <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@analysis.wizard.analysis.section.obstacles.title">
              Obstacles
            </h3>
            <div class="clearfix"></div>
          </div>
        </div>
        <div [ngSwitch]="initObstaclesStatus" class="panel-body">
          <div *ngSwitchCase="indicator.LOADING" >
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.EMPTY" >
            <app-empty-indicator type="relation" entity="obstacles"></app-empty-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitObstaclesError]"></app-error-indicator>
          </div>
          <div *ngSwitchCase="indicator.ACTIVE" class="table-responsive">
            <!-- TODO tabla de obstaculos -->
          </div>
        </div>
      </div>

      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="row">
            <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@analysis.wizard.analysis.section.spatial.title">
              Spatial
            </h3>
            <div class="clearfix"></div>
          </div>
        </div>
        <div [ngSwitch]="initSpatialStatus" class="panel-body">
          <div *ngSwitchCase="indicator.LOADING" >
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitSpatialError]"></app-error-indicator>
          </div>
          <ng-container *ngSwitchCase="indicator.ACTIVE">
            <ul class="nav nav-pills">
              <li *ngFor="let direction of directions"
                  [ngClass]="{'active': (selectedDirection != null && direction.id == selectedDirection.id)}"
                  role="presentation"
              >
                <a (click)="showDirection(direction)"
                   style="cursor: pointer"
                >
                  {{direction.name}}
                </a>
              </li>
            </ul>
            <!--
            <app-map #mapObjects
                     (map)="map"
                     [rotate]="true"
                     [fullScreen]="true"
                     [scale]="true"
                     [layers]="['runway']"
            >
            </app-map> -->
          </ng-container>
        </div>
      </div>

      <br>

      <nav>
        <ul class="pager">
          <li class="next">
            <a (click)="onNext()" style="cursor: pointer">
              <ng-container i18n="@@commons.wizard.next">Next </ng-container>
              <span aria-hidden="true">&rarr;</span>
            </a>
          </li>
          <li class="previous">
            <a (click)="onPrevious()" style="cursor: pointer">
              <span aria-hidden="true">&larr;</span>
              <ng-container i18n="@@commons.wizard.previous"> Previous</ng-container>
            </a>
          </li>
        </ul>
      </nav>
      
    </block-ui>
  `
})

export class AnalysisWizardAnalysisComponent implements OnInit, AfterViewInit {

  @BlockUI() blockUI: NgBlockUI;
  blockTemplate = BlockTemplateComponent;
  initObstaclesStatus:number;
  initSpatialStatus:number;
  indicator;
  onInitObstaclesError:ApiError;
  onInitSpatialError:ApiError;
  onSubmitError:AppError;
  analysisId:number;
/*
  private olmap: OlComponent;
  @ViewChild('mapObjects') set content(content: OlComponent) {
    this.olmap = content;
  }
  map:Map;
*/
  runways:Runway[];
  analysis:Analysis;
  directions: RunwayDirection[];
  selectedDirection: RunwayDirection;

  constructor(
    private wizardService: AnalysisWizardService,
    private analysisService: AnalysisService,
    private runwayService: RunwayService,
    private directionService: DirectionService,
    private route: ActivatedRoute,
    private router: Router
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.blockUI.stop();
    this.analysisId = this.route.snapshot.params['analysisId'];

    this.onInitObstaclesError = null;
    this.onInitSpatialError = null;
    this.onSubmitError = null;

    this.initObstaclesStatus = STATUS_INDICATOR.LOADING;
    this.initSpatialStatus = STATUS_INDICATOR.LOADING;

    this.analysisService.get(this.analysisId)
      .then(data => {
        this.analysis = data;
        return this.runwayService.list(data.airportId)
      })
      .then(data => {
        this.runways = data;
        return Promise.all(
          this.runways.map( r =>
            this.directionService.list(r.airportId,r.id)
              .then( data => {
                r.directions = data;
                r.directions.forEach((d => d.runway = r));
              })
          )
        )
      })
      .then(()=>
        this.directions =
          this.runways.map( r => r.directions)
            .reduce((a,b)=> a.concat(b), [])
      )
      .then( () => this.initSpatialStatus = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitSpatialError = error;
        this.initSpatialStatus = STATUS_INDICATOR.ERROR;
      })
  }

  ngAfterViewInit(): void {
  }

  onNext(){

    this.onSubmitError = null;

    this.blockUI.start("Processing...");

    this.wizardService
      .next(this.analysisId)
      .then( () =>{
        this.blockUI.stop();
        return this.router.navigate([`/analysis/${this.analysisId}/stages/inform`])
      })
      .catch((error) => {
        this.onSubmitError = error;
        this.blockUI.stop();
      });
  }

  onPrevious(){
    this.onSubmitError = null;

    this.wizardService
      .previous(this.analysisId)
      .then( () => this.router.navigate([`/analysis/${this.analysisId}/stages/object`]))
      .catch((error) => this.onSubmitError = error);
  }

  showDirection(direction: RunwayDirection) {
    this.selectedDirection = direction;
  }
}
