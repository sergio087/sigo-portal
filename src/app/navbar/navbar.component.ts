import {Component, Inject} from "@angular/core";
import {Router, RouterState} from "@angular/router";

@Component({
  selector:'app-navbar',
  template:`
    <nav role="navigation" class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">
            S.I.G.O.
          </a>
        </div>

        <div class="collapse navbar-collapse" id="app-navbar">
          <ul class="nav navbar-nav">
            <li routerLinkActive="active">
              <a routerLink="/home"> Home </a>
            </li>
            <li routerLinkActive="active">
              <a routerLink="/airports"> Airports </a>
            </li>
            <li routerLinkActive="active">
              <a routerLink="/objects"> Objects </a>
            </li>
            <li routerLinkActive="active">
              <a routerLink="/regulations"> Regulations </a>
            </li>
            <li routerLinkActive="active">
              <a routerLink="/analysis"> Analysis </a>
            </li>
          </ul>
          <p class="navbar-text navbar-right">
            <span class="glyphicon glyphicon-user" aria-hidden="true"></span>
            Mark Otto
          </p>
        </div>
      </div>
    </nav>
  `
})

export class NavbarComponent{

}
