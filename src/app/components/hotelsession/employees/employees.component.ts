import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreakpointService } from '../../../services/breakpoint.service';
import { TableComponent } from '../../shared/table/table.component';
import { ListComponent } from '../../shared/list/list.component';

@Component({
  selector: 'app-employees',
  imports: [
    RouterModule, 
    TableComponent, 
    ListComponent
  ],
  standalone: true,
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent {
  constructor(public breakpointService: BreakpointService) {}
  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
