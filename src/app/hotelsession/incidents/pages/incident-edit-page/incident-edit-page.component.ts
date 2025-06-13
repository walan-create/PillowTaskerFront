import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Incident } from '../../interfaces/incident.interface';
import { CommonModule } from '@angular/common';
import { firstValueFrom, map } from 'rxjs';
import { IncidentsService } from '../../../services/incident.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormErrorLabelComponent } from '../../../../shared/components/form-error-label/form-error-label.component';

@Component({
  selector: 'app-incident-edit-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './incident-edit-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentEditPageComponent {
  incidentsService = inject(IncidentsService);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  router = inject(Router);

  wasSaved = signal<boolean>(false);

  incidentForm = this.fb.group({
    title: ['', [Validators.required]],
    concept: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });

  incidentId = toSignal(
    this.activatedRoute.params.pipe(map((params) => params['id']))
  );

  ngOnInit() {
    const incidentId = this.incidentId();

    this.incidentsService.getIncidentById(this.incidentId()).subscribe({
      next: (incident) => {
        this.incidentForm.patchValue({
          title: incident.title,
          concept: incident.concept,
          date: incident.date
            ? new Date(incident.date).toISOString().slice(0, 10) // <-- Solo YYYY-MM-DD
            : '',
        });
      },
      error: (err) => {
        // Manejo de error
      },
    });
  }

  async onSubmit() {
    this.incidentForm.markAllAsTouched();
    if (!this.incidentForm.valid) return;

    const formValue = this.incidentForm.value;
    const incidentUpdateData: Partial<Incident> = {
      title: formValue.title ?? '',
      concept: formValue.concept ?? '',
      date: formValue.date ? new Date(formValue.date) : new Date(),
    };

    await firstValueFrom(
      this.incidentsService.updateIncident(
        this.incidentId(),
        incidentUpdateData
      )
    );

    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
  }
}
