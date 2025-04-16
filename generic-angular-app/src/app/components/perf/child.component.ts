import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  Input,
  input,
  Output,
} from '@angular/core';

@Component({
    selector: 'app-child',
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<p>{{ in() }}</p>`
})
export class ChildComponent {
  //   private _input;
  //   @Input()
  //   set input(newVal) {
  //     this._input = newVal;
  //   }

  //   get input() {
  //     return this._input;
  //   }

  in = input.required();

  constructor() {
    effect(() => {
      const i = this.in();
      const sigTimerEnd = performance.now();
      this.out.emit(sigTimerEnd);
    });
  }

  @Output()
  out = new EventEmitter<number>();
}
