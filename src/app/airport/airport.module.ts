import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';

import {AirportRoutingModule} from "./airport-routing.module";
import {AirportComponent} from "./airport.component";
import {AirportSearchComponent} from "./airoport-search.component";
import {AirportService} from "./airport.service";
import {AirportListComponent} from "./airport-list.component";
import {AirportDetailComponent} from "./airport-detail.component";
import {RunwayService} from "../runway/runway.service";
import {AirportDetailGeneralViewComponent} from "./airport-detail-general-view.component";
import {AirportDetailGeneralEditComponent} from "./airport-detail-general-edit.component";
import {CommonsModule} from "../commons/commons.module";
import {AirportDetailChildren} from "./airport-detail-children";
import {AirportDetailGeometryEditComponent} from "./airport-detail-geometry-edit.component";
import {AirportDetailGeometryViewComponent} from "./airport-detail-geometry-view.component";
import {OlService} from "../olmap/ol.service";
import {OlComponent} from "../olmap/ol.component";
import {OlmapModule} from "../olmap/olmap.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AirportRoutingModule,
    CommonsModule,
    OlmapModule
  ],
  declarations: [
    AirportComponent,
    AirportSearchComponent,
    AirportListComponent,
    AirportDetailComponent,
    AirportDetailGeneralViewComponent,
    AirportDetailGeneralEditComponent,
    AirportDetailChildren,
    AirportDetailGeometryViewComponent,
    AirportDetailGeometryEditComponent
  ],
  providers: [
    AirportService,
    RunwayService,
    OlService,
    OlComponent
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AirportModule{}
