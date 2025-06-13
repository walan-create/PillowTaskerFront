import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HotelSessionService } from '../../services/hotel-session.service';
import { BoardComponentService } from '../../services/board.service';

@Component({
  selector: 'app-board',
  imports: [RouterLink],
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  hotelSessionService = inject(HotelSessionService);
  boardService = inject(BoardComponentService);

  board = computed(() => this.boardService);

  // Exponer el rol actual
  userRole = computed(() => this.hotelSessionService.hotelSession()?.rol);

  // Configuración de items para reservas
  reservationItems = [
    {
      title: 'Clientes Hotel',
      key: 'totalClients',
      link: '/hotelsession/reservations',
    },
    {
      title: 'Entradas Hoy',
      key: 'checkInsToday',
      link: '/hotelsession/reservations',
    },
    {
      title: 'Entr. pendientes',
      key: 'checkInsPendingToday',
      link: '/hotelsession/reservations',
    },
    {
      title: 'Entr. Realizadas',
      key: 'checkInsDone',
      link: '/hotelsession/reservations',
    },
  ];

  // Configuración de items para habitaciones
  roomItems = [
    { title: 'Total', key: 'totalRooms', link: '/hotelsession/rooms' },
    {
      title: 'Disponibles',
      key: 'availableRooms',
      link: '/hotelsession/rooms',
    },
    { title: 'Ocupadas', key: 'occupiedRooms', link: '/hotelsession/rooms' },
    { title: 'Hab. Limpias', key: 'cleanRooms', link: '/hotelsession/rooms' },
    { title: 'Hab. Sucias', key: 'dirtyRooms', link: '/hotelsession/rooms' },
    {
      title: 'Mantenimiento',
      key: 'roomsUnderMaintenance',
      link: '/hotelsession/rooms',
    },
  ];

  ngOnInit() {
    this.loadBoard();
  }

  loadBoard() {
    this.boardService.loadHotelBoard().subscribe({
      next: (board) => {
        this.boardService.board.set(board);
      },
      error: (err) => {
        console.error('Error al cargar el tablero', err);
      },
    });
  }

  getBoardValue(key: string): number | string | undefined {
    return (this.boardService.board() as any)?.[key];
  }
}
