import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListComponent } from '../../shared/list/list.component';
import { TableComponent } from '../../shared/table/table.component';
import { BreakpointService } from '../../../services/breakpoint.service';

@Component({
  selector: 'app-reservations',
  imports: [
    RouterModule,
    TableComponent,
    ListComponent
  ],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent {
  constructor(public breakpointService: BreakpointService) {}
  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
