import {
  computed,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RootService {
  private cSignal: Signal<number> | undefined;
  private nSignal: WritableSignal<number> = signal(0);
  private updaterSignalCache: Signal<number> | undefined;

  getNSignal(): Signal<number> {
    return this.nSignal.asReadonly();
  }

  getCSignal(): Signal<number> | undefined {
    return this.cSignal;
  }

  setUpdater(updaterSignal: Signal<number>): Signal<number> {
    if (this.updaterSignalCache === updaterSignal) {
      return this.cSignal!;
    }

    this.updaterSignalCache = updaterSignal;
    this.cSignal = computed(() => {
      return this.nSignal() + this.updaterSignalCache!();
    });
    return this.cSignal;
  }
}
