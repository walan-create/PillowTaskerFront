import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Incident } from '../../interfaces/incident.interface';
import { CommonModule } from '@angular/common';
import { IncidentsService } from '../../services/incident.service';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";

@Component({
  selector: 'app-incident-create-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormErrorLabelComponent
],
  templateUrl: './incident-create-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncidentCreatePageComponent {
  incidentsService = inject(IncidentsService);
  fb = inject(FormBuilder);
  router = inject(Router);

  wasSaved = signal<boolean>(false);

  incidentForm = this.fb.group({
    title: ['', [Validators.required]],
    concept: ['', [Validators.required]],
    date: ['', [Validators.required]],
  });

  async onSubmit() {
    this.incidentForm.markAllAsTouched();
    if (!this.incidentForm.valid) return;

    const formValue = this.incidentForm.value;
    const incidentCreateData: Omit<Incident, 'id'> = {
      title: formValue.title ?? '',
      concept: formValue.concept ?? '',
      date: formValue.date ? new Date(formValue.date) : new Date(),
    };

    await this.incidentsService.createIncident(incidentCreateData).toPromise();
    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 3000);
    this.router.navigate(['/hotelsession/incidents']);
  }
}
