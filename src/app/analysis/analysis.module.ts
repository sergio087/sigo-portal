import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {AnalysisService} from "./analysis.service";
import {AnalysisComponent} from "./analysis.component";
import {CommonModule} from "@angular/common";
import { FormsModule }   from '@angular/forms';
import {CommonsModule} from "../commons/commons.module";
import {OlmapModule} from "../olmap/olmap.module";
import {AnalysisRoutingModule} from "./analysis-routing.module";
import {AnalysisCaseSearchComponent} from "./analysis-search.component";
import {AnalysisCaseListComponent} from "./analysis-list.component";
import {AirportService} from "../airport/airport.service";
import {AnalysisWizardAnalysisComponent} from "./analysis-wizard-analysis.component";
import {AnalysisWizardExceptionComponent} from "./analysis-wizard-exception.component";
import {AnalysisWizardInformComponent} from "./analysis-wizard-inform.component";
import {AnalysisWizardObjectComponent} from "./analysis-wizard-object.component";
import {AnalysisCaseService} from "./analysis-case.service";
import {ElevatedObjectService} from "../object/object.service";
import {PlacedObjectCatalogService} from "../object/object-catalog.service";
import {BlockUIModule} from "ng-block-ui";
import {BlockTemplateComponent} from "../commons/block-template.component";
import {AnalysisObjectService} from "./analysis-object.service";
import {AnalysisExceptionService} from "../exception/exception.service";
import {RegulationService} from "../regulation/regulation.service";
import {AnalysisWizardService} from "./analysis-wizard.service";
import {RunwayService} from "../runway/runway.service";
import {DirectionService} from "../direction/direction.service";
import {AnalysisSurfaceService} from "./analysis-surface.service";
import {AnalysisObstacleService} from "./analysis-obstacle.service";
import {BsModalRef, BsModalService, ComponentLoaderFactory, ModalModule, PositioningService} from 'ngx-bootstrap';
import {AnalysisModalAnalysisComponent} from './analysis-modal-analysis.component';
import {AnalysisResultService} from './analysis-result.service';
import {AnalysisExceptionSurfaceService} from '../exception/exception-surface.service';
import {AnalysisExceptionRuleService} from '../exception/exception-rule.service';
import {AnalysisWizardNewComponent} from './analysis-wizard-new.component';

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    AnalysisRoutingModule,
    CommonsModule,
    OlmapModule,
    BlockUIModule,
    ModalModule
  ],
  declarations: [
    AnalysisComponent,
    AnalysisCaseSearchComponent,
    AnalysisCaseListComponent,
    AnalysisWizardObjectComponent,
    AnalysisWizardExceptionComponent,
    AnalysisWizardAnalysisComponent,
    AnalysisWizardInformComponent,
    AnalysisModalAnalysisComponent,
    AnalysisWizardNewComponent
  ],
  providers: [
    AnalysisCaseService,
    AnalysisService,
    AirportService,
    ElevatedObjectService,
    PlacedObjectCatalogService,
    AnalysisObjectService,
    AnalysisExceptionService,
    AnalysisExceptionSurfaceService,
    AnalysisExceptionRuleService,
    RegulationService,
    AnalysisWizardService,
    RunwayService,
    DirectionService,
    AnalysisSurfaceService,
    AnalysisObstacleService,
    BsModalService,
    BsModalRef,
    AnalysisResultService,
    ComponentLoaderFactory,
    PositioningService
  ],
  entryComponents: [
    BlockTemplateComponent,
    AnalysisModalAnalysisComponent
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AnalysisModule {

}
