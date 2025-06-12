import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Client } from '../../interfaces/client.interface';
import { ClientsService } from '../../services/clients.service';
import { RouterLink } from '@angular/router';
import { ListToolbarComponent } from '../../../../shared/components/list-toolbar/list-toolbar.component';
import { AppTableComponent } from '@shared/components/table/table.component';
import { AppTableColumn } from '@shared/interfaces/app-table-column.interface';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';
import { BreakpointService } from '../../../../services/breakpoint.service';
import { AppListComponent } from '../../../../shared/components/list/list.component';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [
    AppTableComponent,
    RouterLink,
    ListToolbarComponent,
    ReusableModalComponent,
    AppListComponent,
  ],
  templateUrl: './clients-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsPageComponent implements OnInit {
  clientsService = inject(ClientsService);
  breakpointService = inject(BreakpointService);
  notificationService = inject(NotificationService);

  clientColumns: AppTableColumn<Client>[] = [
    { key: 'name', label: 'Nombre', headerClass: 'col-1' },
    { key: 'surname1', label: 'Apellido 1', headerClass: 'col-2' },
    { key: 'surname2', label: 'Apellido 2', headerClass: 'col-2' },
    { key: 'nif', label: 'NIF', headerClass: 'col-2' },
    {
      key: 'birthDate',
      label: 'Nacimiento',
      headerClass: 'col-2',
      cellTemplate: (row: Client) =>
        row.birthDate instanceof Date && !isNaN(row.birthDate.getTime())
          ? row.birthDate.toLocaleDateString()
          : '',
    },
    { key: 'nationality', label: 'País', headerClass: 'col-1' },
    { key: 'phoneNumber', label: 'Teléfono', headerClass: 'col-' },
  ];

  globalError = this.notificationService.getError();
  searchText: string = '';
  orderBy: keyof Client = 'name';
  orderDirection: 'asc' | 'desc' = 'asc';

  clients = computed(() => {
    // Siempre parsea a Date por seguridad
    return this.clientsService.clients().map((client) => ({
      ...client,
      birthDate:
        client.birthDate instanceof Date
          ? client.birthDate
          : new Date(client.birthDate),
    }));
  });
  clientIdToDelete = signal<number>(0);

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.clientsService.loadHotelClients().subscribe({
      next: (clients) => {
        // Siempre parsea a Date antes de setear
        const parsedClients = clients.map((client) => ({
          ...client,
          birthDate:
            client.birthDate instanceof Date
              ? client.birthDate
              : new Date(client.birthDate),
        }));
        this.clientsService.clients.set(parsedClients);
      },
      error: (err) => {
        this.notificationService.showError(
          err?.error?.message || 'Error al cargar clientes'
        );
      },
    });
  }

  onSearchTextChange(text: string) {
    this.searchText = text;
  }

  onOrderByChange(orderBy: string) {
    this.orderBy = orderBy as keyof Client;
  }

  onOrderDirectionChange(direction: 'asc' | 'desc') {
    this.orderDirection = direction;
  }

  openDeleteClientModal(clientId: number) {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.clientIdToDelete.set(clientId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  handleDeleteClient() {
    const id = this.clientIdToDelete();
    if (id !== null) {
      this.clientsService.deleteClient(id).subscribe({
        next: () => {
          console.log('Cliente eliminado exitosamente');
        },
        error: (err) => {
          this.notificationService.showError(
            err?.error?.message || 'Error al eliminar el cliente'
          );
        },
      });
    }
  }

  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }
}
