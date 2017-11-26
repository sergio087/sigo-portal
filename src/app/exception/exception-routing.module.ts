import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ExceptionComponent} from "./exception.component";
import {ExceptionNewRuleComponent} from "./exception-new-rule.component";
import {ExceptionNewComponent} from "./exception-new.component";
import {ExceptionNewRuleIcao14Component} from "./exception-new-rule-icao.component";

const routes :Routes = [
  {
    path: '',
    component: ExceptionComponent,
    children: [
      {
        path: 'new',
        component: ExceptionNewComponent
      },
      {
        path: 'new/surface',
        component: null
      },
      {
        path: 'new/rule',
        component: ExceptionNewRuleComponent,
        children: [
          {
            path:'icao14',
            component:ExceptionNewRuleIcao14Component
          }
        ]
      },
      {
        path: 'surface/:exceptionId/detail',
        component: null
      },
      {
        path: 'rule/:exceptionId/detail',
        component: null
      }
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(routes)
  ],
  declarations: [],
  exports:[
    RouterModule
  ]
})

export class ExceptionRoutingModule {

}
