import {Injectable} from "@angular/core";
import {AppSettings} from "../main/app-settings";
import {RunwayDirectionPosition} from "./runwayDirectionPosition";
import "rxjs/add/operator/toPromise";
import {ApiService} from "../main/api.service";
import {AuthHttp} from 'angular2-jwt';

@Injectable()

export class DirectionCatalogService extends ApiService {

  constructor(http: AuthHttp){super(http)}

  listPositions() : Promise<RunwayDirectionPosition[]> {
    return this.http
      .get(`${AppSettings.API_ENDPOINT}/catalogs/airports/runways/directions/positions`)
      .toPromise()
      .then((response) => response.json() as RunwayDirectionPosition[])
      .catch(this.handleError)
  }
}
