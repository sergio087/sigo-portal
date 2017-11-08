import {Component, OnInit} from "@angular/core";
import {AnalysisCase} from "./analysisCase";
import {ApiError} from "../main/apiError";
import {AnalysisService} from "./analysis.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ActivatedRoute, Router} from "@angular/router";
import {AirportService} from "../airport/airport.service";
import AnalysisStages from "./analysisStages";
import {Analysis} from "./analysis";

@Component({
  template:`
    <div [ngSwitch]="status" class="container-fluid">

      <div *ngSwitchCase="indicator.LOADING">
        <app-loading-indicator></app-loading-indicator>
      </div>
      <div *ngSwitchCase="indicator.EMPTY">
        <app-empty-indicator type="result" entity="cases"></app-empty-indicator>
      </div>
      <div *ngSwitchCase="indicator.ERROR">
        <app-error-indicator [error]="onInitError"></app-error-indicator>
      </div>

      <ul *ngSwitchCase="indicator.ACTIVE" class="media-list">
        <li *ngFor="let analysis of results" class="media media-border">
          <div class="media-left">

          </div>
          <div class="media-body">
            <h4 class="media-heading">
              <a routerLink="/analysis/{{analysis.id}}/stages/{{stages[analysis.statusId]}}">{{analysis.airport.codeFIR}}</a>
            </h4>
            <p>{{analysis.airport.nameFIR}}</p>
            <p>Creation: <i>{{analysis.creationDate | date:'yyyy-MM-dd HH:mm'}}</i></p>
            <p>User: <i>Mark Otto</i></p>
          </div>
          <div class="media-right">
            <button type="button" 
                    (click)="cloneCase(analysis.id)"
                    *ngIf="analysis.statusId == 2"
                    class="btn btn-default btn-sm" 
                    i18n="@@commons.button.new">
              New
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
  stages: Array<string>;

  constructor(
    private caseService : AnalysisService,
    private airportService : AirportService,
    private analysisService : AnalysisService,
    private route: ActivatedRoute,
    private router : Router
  ){
    this.results = [];
    this.indicator = STATUS_INDICATOR;
    this.stages = AnalysisStages;
  }

  ngOnInit(): void {

    this.onInitError = null;
    this.status = STATUS_INDICATOR.LOADING;

    this.caseService
      .search(this.route.snapshot.queryParamMap)
      .then(data => this.results = data)
      .then(()=> Promise.all(this.results.map(r => this.airportService.get(r.airportId).then((airport) => r.airport = airport))))
      .then(()=> this.status = STATUS_INDICATOR.ACTIVE)
      .catch(error => this.status=STATUS_INDICATOR.ERROR);

  }

  cloneCase(caseId: number) {
    this.analysisService
      .create(caseId)
      .then(data => this.router.navigate([`/analysis/${data.id}/stages/object`]))
    //TODO catch and show error
  }
}