import { Component } from '@angular/core';
import { TableComponent } from "../../shared/table/table.component";
import { ListComponent } from "../../shared/list/list.component";
import { BreakpointService } from '../../../services/breakpoint.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [
    RouterModule,
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
