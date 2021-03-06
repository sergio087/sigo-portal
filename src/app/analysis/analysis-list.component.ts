import {Component, OnInit} from "@angular/core";
import {ApiError} from "../main/apiError";
import {AnalysisService} from "./analysis.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ActivatedRoute, Router} from "@angular/router";
import {AirportService} from "../airport/airport.service";
import {Analysis} from "./analysis";
import {AnalysisWizardService} from "./analysis-wizard.service";
import {AppError} from '../main/ierror';

@Component({
  template:`

    <div *ngIf="onSubmitError">
      <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>
    </div>
    
    <div [ngSwitch]="status" class="container-fluid">

      <div *ngSwitchCase="indicator.LOADING">
        <app-loading-indicator></app-loading-indicator>
      </div>
      <div *ngSwitchCase="indicator.EMPTY">
        <app-empty-indicator type="result" entity="cases"></app-empty-indicator>
      </div>
      <div *ngSwitchCase="indicator.ERROR">
        <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
      </div>

      <ul *ngSwitchCase="indicator.ACTIVE" class="media-list">
        <li *ngFor="let analysis of results" class="media media-border">
          <div class="media-left">

          </div>
          <div class="media-body">
            <h4 class="media-heading">
              <ng-container *ngIf="analysis.statusId > 0">
                <a routerLink="/analysis/{{analysis.id}}/stages/{{stages[analysis.stageId]}}">
                  {{(analysis.airport.codeFIR)?analysis.airport.codeFIR:analysis.airport.codeLocal}}
                </a>
                <span class="label" [ngClass]="{'label-info': analysis.statusId <= 1, 'label-default': analysis.statusId == 2, 'label-danger': analysis.statusId == 3}">{{stages[analysis.stageId]}}</span>
              </ng-container>
              <ng-container *ngIf="analysis.statusId == 0">
                {{(analysis.airport.codeFIR)?analysis.airport.codeFIR:analysis.airport.codeLocal}}
              </ng-container>
            </h4>
            <p>{{analysis.airport.nameFIR}}</p>
            <p>Creation: <i>{{analysis.creationDate | date:'yyyy-MM-dd HH:mm'}}</i></p>
            <p>Edition: <i>{{analysis.editionDate | date:'yyyy-MM-dd HH:mm'}}</i></p>
            <p>User: <i>{{analysis.userNickname}}</i></p>
          </div>
          <div class="media-right">
            <button type="button" 
                    (click)="cloneCase(analysis.id)"
                    *ngIf="analysis.statusId == 2"
                    class="btn btn-primary btn-sm" 
                    i18n="@@commons.button.new"
            >
              New
            </button>
            <button type="button"
                    (click)="startCase(analysis.id)"
                    *ngIf="analysis.statusId == 0"
                    class="btn btn-primary btn-sm"
                    i18n="@@commons.button.start"
            >
              Start
            </button>
          </div>
        </li>
      </ul>
    </div>
  `
})

export class AnalysisCaseListComponent implements OnInit {

  results : Analysis[];
  status : number;
  indicator;
  onInitError : ApiError;
  onSubmitError: AppError;
  stages: Array<string>;

  constructor(
    private caseService : AnalysisService,
    private airportService : AirportService,
    private analysisService : AnalysisService,
    private wizardService: AnalysisWizardService,
    private route: ActivatedRoute,
    private router : Router
  ){
    this.results = [];
    this.indicator = STATUS_INDICATOR;
    this.stages = this.wizardService.stages();
  }

  ngOnInit(): void {

    this.onInitError = null;
    this.status = STATUS_INDICATOR.LOADING;

    let paramMap = this.route.snapshot.queryParamMap;

    this.caseService
      .search(paramMap)
      .then(data => this.results = data)
      .then(()=> Promise.all(this.results.map(r => this.airportService.get(r.airportId).then((airport) => r.airport = airport))))
      .then(()=> {
        (this.results.length > 0) ? this.status = STATUS_INDICATOR.ACTIVE : this.status = STATUS_INDICATOR.EMPTY;
      })
      .catch(error => this.status=STATUS_INDICATOR.ERROR);

  }

  cloneCase(caseId: number) {
    this.onSubmitError = null;

    this.analysisService
      .create({parentId: caseId})
      .then(data => this.startCase(data.caseId))
      .catch(error => this.onSubmitError = error);
  }

  startCase(caseId: number) {
    this.onSubmitError = null;

    this.wizardService
      .start(caseId)
      .then(data => this.router.navigateByUrl(`/analysis/${data.id}/stages/object`))
      .catch(error => this.onSubmitError = error);
  }
}
