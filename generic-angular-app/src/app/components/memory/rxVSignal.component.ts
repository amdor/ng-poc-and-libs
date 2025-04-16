import { CommonModule } from '@angular/common';
import {
  Component,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-rx-v-signal',
    imports: [RouterModule, CommonModule],
    template: `<a routerLink="..">TO First component</a>
    @for(sig of sigs; track sig){
    {{ sig() }}
    }
    <!-- @for(subj$ of subArr$; track subj$){
        {{subj$ | async}}
     } --> `
})
export class RxVSignalComponent {
  sigs: WritableSignal<number>[] = [];
  // compSigs: Signal<number>[] = [];
  //   subArr$: BehaviorSubject<number>[] = [];
  //   combObsArr$: Observable<number>[] = [];

  constructor() {
    for (let i = 0; i < 100000; i++) {
      //   this.subArr$.push(new BehaviorSubject(i));
      this.sigs.push(signal(i));
    }
    // for(let i = 0; i < 100000; i++) {
    // this.compSigs.push(computed(() => {
    //     return this.sigs[i]() +( this.sigs[i+1]?.() ?? 0);
    // }));
    // }

    // for (let i = 0; i < 100000; i++) {
    //   const comb$ = combineLatest([
    //     this.subArr$[i],
    //     this.subArr$[i + 1] ?? of(0),
    //   ]).pipe(map(([a, b]) => a + b));
    //   this.combObsArr$.push(comb$);
    // }
  }
}
