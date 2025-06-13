import {
  Component,
  OnInit,
  ViewChild,
  inject,
  computed,
  signal,
} from '@angular/core';
import { Incident } from '../../interfaces/incident.interface';
import { RouterLink } from '@angular/router';
import { ListToolbarComponent } from '@shared/components/list-toolbar/list-toolbar.component';
import { AppListComponent } from '@shared/components/list/list.component';
import { ReusableModalComponent } from '@shared/components/reusable-modal/reusable-modal.component';
import { AppTableComponent } from '@shared/components/table/table.component';
import { IncidentsService } from '../../../services/incident.service';
import { AppTableColumn } from '@shared/interfaces/app-table-column.interface';
import { BreakpointService } from '../../../../services/breakpoint.service';

@Component({
  selector: 'app-incidents-page',
  standalone: true,
  imports: [
    AppTableComponent,
    RouterLink,
    ListToolbarComponent,
    ReusableModalComponent,
    AppListComponent,
  ],
  templateUrl: './incidents-page.component.html',
})
export class IncidentsPageComponent implements OnInit {
  incidentsService = inject(IncidentsService);
  breakpointService = inject(BreakpointService);

  incidentColumns: AppTableColumn<Incident>[] = [
    { key: 'title', label: 'Título', headerClass: 'col-3' },
    { key: 'concept', label: 'Concepto', headerClass: 'col-5' },
    {
      key: 'date',
      label: 'Fecha',
      headerClass: 'col-2',
      cellTemplate: (row: Incident) => new Date(row.date).toLocaleString(),
    },
  ];

  searchText: string = '';
  orderBy: keyof Incident = 'date';
  orderDirection: 'asc' | 'desc' = 'desc';

  incidents = computed(() => this.incidentsService.incidents());
  incidentIdToDelete = signal<number>(0);

  @ViewChild(ReusableModalComponent)
  reusableModal!: ReusableModalComponent;

  ngOnInit() {
    this.loadIncidents();
  }

  loadIncidents() {
    this.incidentsService.loadHotelIncidents().subscribe({
      next: (incidents) => this.incidentsService.incidents.set(incidents),
      error: (err) => console.error('Error loading incidents:', err),
    });
  }

  onSearchTextChange(text: string) {
    this.searchText = text;
  }

  onOrderByChange(orderBy: string) {
    this.orderBy = orderBy as keyof Incident;
  }

  onOrderDirectionChange(direction: 'asc' | 'desc') {
    this.orderDirection = direction;
  }

  openDeleteIncidentModal(incidentId: number) {
    const modalElement = document.getElementById('reusableModal');
    if (modalElement) {
      this.incidentIdToDelete.set(incidentId);
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  get isMobileOrTablet() {
    return this.breakpointService.isMobileOrTablet;
  }

  handleDeleteIncident() {
    const id = this.incidentIdToDelete();
    if (id) {
      this.incidentsService.deleteIncident(id).subscribe({
        next: () => this.loadIncidents(),
        error: (err) => console.error('Error deleting incident:', err),
      });
    }
  }
}
