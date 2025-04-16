import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RootService } from '../services/root.service';

@Component({
    selector: 'app-second',
    imports: [RouterModule],
    template: `<a routerLink="..">TO First component</a>
    <br />
    {{service.getCSignal()}} `
})
export class SecondComponent {
  service = inject(RootService);
}
