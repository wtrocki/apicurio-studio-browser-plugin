/**
 * @license
 * Copyright 2018 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Component, OnInit} from '@angular/core';
import {ApiDefinition} from 'apicurio-design-studio';
import {WindowRef} from './services/window-ref.service';
import {AppInfoService} from "./services/app-info.service";
import {environment} from '../environments/environment';
import { CrossNavApp, getAvailableApps, getSolutionExplorerServer } from '@rh-uxd/integration-core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

    helpExpanded: boolean = false;
    showAbout: boolean = false;
    crossConsoleExpanded: boolean = false;
    showCrossConsole: boolean = false;
    showLogo: boolean = false;
    apps: CrossNavApp[] = [];
    apiDef: ApiDefinition = null;

    constructor(private winRef: WindowRef, public appInfo: AppInfoService, private http: HttpClient) {
    }

    public ngOnInit () {
        getAvailableApps(
            environment.production ? getSolutionExplorerServer() : 'http://localhost:5001',
            undefined,
            environment.production  ? undefined : 'localhost:3006',
            ['apicurito'],
            !!environment.production 
          ).then(apps => {
              if (apps.length > 0) {
                this.apps = apps;
                this.showCrossConsole = true;
              } else {
                this.showLogo = true;
              }
          });
          const queryString = window.location.search;
          const urlParams = new URLSearchParams(queryString);
            const api = urlParams.get('api');
            console.log("Loading editor with api: " + api);
            this.http.get(api).toPromise().then(content => {
                this.openEditor(content);
            })
    }

    public navigate(url: string): void {
        const appUrl = !!environment.production ? `https://${url}` : `http://${url}`
        window.location.href = appUrl;
    }

    public openEditor(content: any): void {
        this.apiDef = new ApiDefinition();
        this.apiDef.createdBy = 'user';
        this.apiDef.createdOn = new Date();
        this.apiDef.tags = [];
        this.apiDef.description = '';
        this.apiDef.id = 'api-1';
        this.apiDef.spec = content;
        this.apiDef.type = "OpenAPI30";
        if (content && content.swagger && content.swagger == "2.0") {
            this.apiDef.type = "OpenAPI20";
        }
    }
}
