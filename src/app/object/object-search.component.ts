import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {ElevatedObjectType, ElevatedObjectTypeFactory} from './objectType';

@Component({
  template: `
    <h1 i18n="@@object.search.title">
      Elevated Objects
    </h1>
    <p i18n="@@object.search.main_description">
      This section allows users to manage elevated objects.
    </p>
    <hr/>

    <div class="container-fluid">
      <div class="row">
        <form #searchForm="ngForm" class="form" role="form" (ngSubmit)="onSubmit()">
          <div class="row form-group">
            <div class="col-lg-8 col-lg-offset-2">
              <div class="input-group input-group-lg">
                <div class="input-group-btn">
                  <button type="button" class="btn btn-default" tabindex="-1">{{searchType.description}}</button>
                  <button type="button" tabindex="-1" data-toggle="dropdown" class="btn btn-default dropdown-toggle">
                    <span class="caret"></span>
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li *ngFor="let type of searchTypes">
                      <a (click)="setSearchType(type)" *ngIf="type != searchType">{{type.description}}</a>
                    </li>
                  </ul>
                </div>
                <input
                  type="search"
                  name="searchText"
                  [(ngModel)]="searchName"
                  class="form-control input-lg"
                  i18n-placeholder="@@object.detail.section.general.inputName"
                  placeholder="Name"
                  (ngModelChange)="clearList()"
                  autofocus
                  maxlength="80"
                  required>
                <span class="input-group-btn" role="group">
                  <button type="submit"
                          class="btn btn-lg btn-primary"
                          [disabled]="searchForm.invalid"
                          i18n-title="@@commons.button.search"
                          title="Search"
                  >
                    <span class="glyphicon glyphicon-search"></span>
                  </button>
                  <button type="button"
                          (click)="onFilter()"
                          class="btn btn-lg btn-primary"
                          i18n-title="@@commons.button.filter"
                          title="Filter"
                  >
                    <span class="glyphicon glyphicon-filter"></span>
                  </button>
                </span>
              </div>
            </div>
            <div class="col-md-2">
              <a type="button"
                 routerLink="/objects/new"
                 class="btn btn-primary btn-lg"
                 i18n-title="@@commons.button.new"
                 title="New">
                <span class="glyphicon glyphicon-plus"></span>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
    <br>
    <br>
    <router-outlet></router-outlet>
  `
})

export class ObjectSearchComponent implements OnInit {

  searchTypes: ElevatedObjectType[];
  searchType: ElevatedObjectType;
  searchName: string = '';

  constructor(
    private router : Router
  ){}

  ngOnInit(): void {
    this.searchTypes = ElevatedObjectTypeFactory.getTypes();
    this.searchType = this.searchTypes[0];
    this.searchName = '';
  }

  setSearchType = (type) => {
    this.searchType = type;
    this.searchName = '';
    this.clearList();
  };

  onSubmit = () => {
    this.router.navigate(
      ['/objects/search/list'],
      {queryParams: {type: this.searchType.id, name: this.searchName }});
  };

  clearList = () => {
    if(!this.router.isActive('/objects/search', true))
      this.router.navigate(['/objects/search']);
  };

  onFilter = () => {

  }
}
