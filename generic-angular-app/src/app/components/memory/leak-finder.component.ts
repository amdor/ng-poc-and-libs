import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  signal,
  ElementRef,
  createComponent,
  AfterViewInit,
  EnvironmentInjector,
  inject,
  ApplicationRef,
} from '@angular/core';

@Component({
  selector: 'app-leaky-leakerson',
  template: `I'm here`,
  standalone: true,
})
export class LeakyComponent implements OnInit, OnDestroy {
  private _count = 0;

  ngOnInit(): void {
    setInterval(() => console.log(this._count++), 1000);
    console.log('Initialized');
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
  }
}

@Component({
  selector: 'app-leak-finder',
  template: `
    <ng-template #myFragment>
      <app-leaky-leakerson></app-leaky-leakerson>
    </ng-template>
    @if(show()) {
    <!-- <app-leaky-leakerson #ref></app-leaky-leakerson> -->
    <ng-container *ngTemplateOutlet="myFragment"></ng-container>
    }
    <br />
    <button (click)="onClick()">Toggle</button>'
  `,
  standalone: true,
  imports: [LeakyComponent, CommonModule],
})
export class LeakFinderComponent {
  // @ViewChild('ref') ref: LeakyComponent;
  @ViewChild('ref', { read: ElementRef }) ref: ElementRef;

  show = signal(true);

  onClick() {
    for (let i = 0; i < 200; i++) {
      setTimeout(() => {
        this.show.set(!this.show());
      }, 1);
    }
  }
}
