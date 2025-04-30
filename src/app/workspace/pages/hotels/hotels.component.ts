import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreakpointService } from '../../../services/breakpoint.service';
import { ListComponent } from '@shared/components/list/list.component';
import { TableComponent } from '@shared/components/table/table.component';

@Component({
  selector: 'app-hotels',
  imports: [RouterLink,ListComponent,TableComponent],
  templateUrl: './hotels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsComponent {
  constructor(public breakpointService: BreakpointService) {}
  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
 }
