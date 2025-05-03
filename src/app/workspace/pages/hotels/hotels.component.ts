import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreakpointService } from '../../../services/breakpoint.service';
import { HotelsTableComponent } from '../../components/hotels-table/hotels-table.component';
import { AuthService } from '@auth/services/auth.service';
import { HotelsService } from '../../services/hotels.service';
import { HotelsListComponent } from '../../components/hotels-list/hotels-list.component';

@Component({
  selector: 'app-hotels',
  imports: [RouterLink, HotelsTableComponent, HotelsListComponent],
  templateUrl: './hotels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsComponent {

  authService = inject(AuthService);
  hotelsService = inject(HotelsService);
  breakpointService = inject(BreakpointService);

  // Señal computada que escucha al invitations GLOBAL del Service (Cualquier actualización se verá reflejada)
  hotels = computed(() => this.hotelsService.hotels());

  ngOnInit() {
    // Cargar las invitaciones al cargar el componente
    this.loadHotels();
  }

  loadHotels() {
    this.hotelsService.loadUserHotels().subscribe({
      next: (hotels) => {
        // Actualizar el signal con las invitaciones obtenidas
        this.hotelsService.hotels.set(hotels);
      },
      error: (err) => {
        console.error('Error al cargar los Hoteles', err);
      },
    });
  }

  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
