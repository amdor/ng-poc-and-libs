import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  of,
  Subject,
  Subscription,
} from 'rxjs';
import { ChildComponent } from './child.component';

@Component({
    selector: 'app-rx-v-signal-perf',
    imports: [RouterModule, CommonModule, ChildComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <a routerLink="..">TO First component</a>
    <app-child [in]="sig()" (out)="changedSig($event)"></app-child>
    <app-child [in]="subj$ | async" (out)="changedSub($event)"></app-child>
    Sig:
    <button (click)="onClickSig()">CLICK MEEEE!!</button>
    Sub:
    <button (click)="onClickSub()">CLICK MEEEE!!</button>
  `
})
export class RxVSignalPerfComponent {
  sig = signal(0);
  constSig = signal(1);
  cSig = computed(() => this.sig() + this.constSig());

  subj$ = new BehaviorSubject(0);
  constSubj$ = new BehaviorSubject(1);
  cSubj$ = combineLatest([this.subj$, this.constSubj$]).pipe(
    map(([a, b]) => a + b)
  );

  i = 0;
  sigTimeAvg: number[] = [];
  subTimeAvg: number[] = [];
  timerStart: number | undefined;

  constructor() {
    const interval = setInterval(() => {
      if (this.i > 1000) {
        clearInterval(interval);
        return;
      }
      this.i % 2 ? this.onClickSig() : this.onClickSub();
    }, 100);
  }

  onClickSig(): void {
    this.i++;
    this.timerStart = performance.now();
    this.sig.set(this.i);
  }

  onClickSub(): void {
    this.i++;
    this.timerStart = performance.now();
    this.subj$.next(this.i);
  }

  changedSig(timeEnd) {
    if (this.timerStart) {
      this.sigTimeAvg.push(timeEnd - this.timerStart);
    }
    const sum = this.sigTimeAvg.reduce((acc, e) => acc + e, 0);
    console.log('sig', sum / this.sigTimeAvg.length);
  }

  changedSub(timeEnd) {
    if (this.timerStart) {
      this.subTimeAvg.push(timeEnd - this.timerStart);
    }
    const sum = this.subTimeAvg.reduce((acc, e) => acc + e, 0);
    console.log('sub', sum / this.subTimeAvg.length);
  }
}
