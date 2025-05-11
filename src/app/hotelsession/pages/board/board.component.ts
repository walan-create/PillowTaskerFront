import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardResponse } from '../../interfaces/board-response.interface';
import { HotelSessionService } from '../../services/hotel-session.service';
import { BoardComponentService } from '../../services/board.service';
import { BoardItemComponent } from '../../components/board-item/board-item.component';

@Component({
  selector: 'app-board',
  imports: [RouterLink, BoardItemComponent],
  templateUrl: './board.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit {
  hotelSessionService = inject(HotelSessionService);
  boardService = inject(BoardComponentService);

  board = computed(() => this.boardService);

  ngOnInit() {
    // Cargar las invitaciones al cargar el componente
    this.loadBoard();
  }

  loadBoard() {
    this.boardService.loadHotelBoard().subscribe({
      next: (board) => {
        // Actualizar el signal con las invitaciones obtenidas
        this.boardService.board.set(board);
      },
      error: (err) => {
        console.error('Error al cargar el tablero', err);
      },
    });
  }
}
