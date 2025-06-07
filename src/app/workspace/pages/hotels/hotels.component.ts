import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreakpointService } from '../../../services/breakpoint.service';
import { HotelsService } from '../../services/hotels.service';
import { ListToolbarComponent } from '../../../shared/components/list-toolbar/list-toolbar.component';
import { AppTableComponent } from '@shared/components/table/table.component';
import { AppTableColumn } from '@shared/interfaces/app-table-column.interface';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';
import { AppListComponent } from '../../../shared/components/list/list.component';
import { Hotel } from '../../interfaces/hotel.interface';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [
    RouterLink,
    AppTableComponent,
    ListToolbarComponent,
    ReusableModalComponent,
    AppListComponent,
  ],
  templateUrl: './hotels.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsComponent implements OnInit {
  authService = inject(AuthService);
  hotelsService = inject(HotelsService);
  breakpointService = inject(BreakpointService);

  hotelColumns: AppTableColumn<Hotel>[] = [
    { key: 'name', label: 'Nombre', headerClass: 'col-2' },
    { key: 'address', label: 'Dirección', headerClass: 'col-3' },
    { key: 'postalCode', label: 'Código Postal', headerClass: 'col-2' },
    {
      key: 'userId',
      label: 'Propiedad',
      headerClass: 'col-1',
      cellTemplate: (hotel: Hotel) =>
        hotel.userId === this.authService.user()?.id ? 'Propio' : 'Ajeno',
    },
    { key: 'totalRooms', label: 'Habitaciones', headerClass: 'col-1' },
    { key: 'totalEmployees', label: 'Empleados', headerClass: 'col-1' },
  ];

  searchText: string = '';
  orderBy: keyof Hotel = 'name';
  orderDirection: 'asc' | 'desc' = 'asc';

  hotels = computed(() => this.hotelsService.hotels());
  hotelIdToDelete = signal<number | null>(null);

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelsService.loadUserHotels().subscribe({
      next: (hotels) => {
        this.hotelsService.hotels.set(hotels);
      },
      error: (err) => {
        console.error('Error al cargar los Hoteles', err);
      },
    });
  }

  onSearchTextChange(text: string) {
    this.searchText = text;
  }

  onOrderByChange(orderBy: string) {
    this.orderBy = orderBy as keyof Hotel;
  }

  onOrderDirectionChange(direction: 'asc' | 'desc') {
    this.orderDirection = direction;
  }

  openDeleteHotelModal(hotelId: number) {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.hotelIdToDelete.set(hotelId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleDeleteHotel() {
    const id = this.hotelIdToDelete();
    if (id !== null) {
      this.hotelsService.deleteHotel(id).subscribe({
        next: () => {
          this.loadHotels();
        },
        error: (err) => {
          console.error('Error al eliminar el hotel', err);
        },
      });
    }
  }

  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
