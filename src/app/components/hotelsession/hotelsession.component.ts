import { Component } from '@angular/core';
import { HeaderHotelsessionComponent } from "./header-hotelsession/header-hotelsession.component";
import { RouterOutlet } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { EmployeesComponent } from './employees/employees.component';
import { RoomsComponent } from './rooms/rooms.component';
import { ClientsComponent } from '../../clients/clients.component';
import { ServicesComponent } from './services/services.component';
import { ReservationsComponent } from './reservations/reservations.component';

@Component({
  selector: 'app-hotelsession',
  imports: [
    RouterOutlet,
    HeaderHotelsessionComponent,
    BoardComponent,
    EmployeesComponent,
    RoomsComponent,
    ClientsComponent,
    ServicesComponent,
    ReservationsComponent
  ],
  templateUrl: './hotelsession.component.html',
  styleUrl: './hotelsession.component.scss'
})
export class HotelsessionComponent {

}
