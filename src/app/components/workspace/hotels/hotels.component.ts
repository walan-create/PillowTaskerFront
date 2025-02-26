import { Component } from '@angular/core';
import { TableComponent } from "../../shared/table/table.component";
import { ListComponent } from "../../shared/list/list.component";

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [TableComponent, ListComponent],
  templateUrl: './hotels.component.html',
  styleUrl: './hotels.component.scss'
})
export class HotelsComponent {

}
