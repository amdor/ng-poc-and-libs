import { ApplicationConfig, Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes } from '@angular/router';
import 'zone.js';
import { FirstComponent } from './app/components/first.component';
import { RxVSignalComponent } from './app/components/memory/rxVSignal.component';
import { SecondComponent } from './app/components/second.component';
import { RxVSignalPerfComponent } from './app/components/perf/rxVSignal.component';
import { LeakFinderComponent } from './app/components/memory/leak-finder.component';

export const routes: Routes = [
  { path: '', component: FirstComponent },
  { path: 'second', component: SecondComponent },
  { path: 'rxVSignal', component: RxVSignalComponent },
  { path: 'rxVSignalPerf', component: RxVSignalPerfComponent },
  { path: 'leakFinder', component: LeakFinderComponent },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    template: `<router-outlet />`
})
export class App {}

bootstrapApplication(App, appConfig);
