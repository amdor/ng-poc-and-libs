import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  template: `
    <a routerLink="/second" id="link">TO Second component</a> <br />
    <a routerLink="/rxVSignal" id="link">TO RxVSignal</a> <br />
    <a routerLink="/rxVSignalPerf" id="link">TO RxVSignal Perf</a> <br />
    <a routerLink="/leakFinder" id="link">Leak finder</a> <br />
    <br />
  `,
})
export class FirstComponent {}
