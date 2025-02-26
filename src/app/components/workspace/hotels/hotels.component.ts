import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';	
import { TableComponent } from "../../shared/table/table.component";
import { ListComponent } from "../../shared/list/list.component";
import { map } from 'rxjs';
import { BreakpointService } from '../../../services/breakpoint.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [
    TableComponent,
    ListComponent
  ],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.scss'
})
export class HotelsComponent {
  constructor(public breakpointService: BreakpointService) {}
  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
