import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableComponent } from '../../shared/table/table.component';
import { ListComponent } from '../../shared/list/list.component';
import { BreakpointService } from '../../../services/breakpoint.service';

@Component({
  selector: 'app-clients',
  imports: [
    RouterModule,
    TableComponent,
    ListComponent
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  constructor(public breakpointService: BreakpointService) {}
    get isMobileOrTablet() {
      return this.breakpointService.isMobileOrTablet;
    }
}
