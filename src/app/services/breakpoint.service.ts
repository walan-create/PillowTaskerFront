import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);

  private isMobileOrTablet$ = this.breakpointObserver
  //.observe([Breakpoints.Handset]) // Detectamos móvil y tablet (funciona mal)
  .observe(['(max-width: 1024px)']) // 📌 Definimos el breakpoint nosotros: <= 1024px es mobile/tablet
  .pipe(
    map(result => result.matches)
  );

  isMobileOrTablet = toSignal(this.isMobileOrTablet$, {initialValue: false})
}
