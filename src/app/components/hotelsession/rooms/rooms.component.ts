import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableComponent } from '../../shared/table/table.component';
import { ListComponent } from '../../shared/list/list.component';
import { BreakpointService } from '../../../services/breakpoint.service';

@Component({
  selector: 'app-rooms',
  imports: [
    RouterModule, 
    TableComponent, 
    ListComponent
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent {
    constructor(public breakpointService: BreakpointService) {}
    get isMobileOrTablet() {
      return this.breakpointService.isMobileOrTablet;
    }
}
