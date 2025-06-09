import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationsService } from '../../services/reservations.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservations-checkin-page',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './reservations-checkin-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationsCheckinPageComponent implements OnInit {
  reservationsService = inject(ReservationsService);
  activatedRoute = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  router = inject(Router);

  wasSaved = signal<boolean>(false);

  checkinForm = this.fb.group({
    clientIds: [[], Validators.required], // Aquí irá el selector de clientes
    roomIds: [[], Validators.required],   // Aquí irá el selector de habitaciones
  });

  reservationId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  ngOnInit() {
    // Puedes cargar aquí la reserva si necesitas mostrar info adicional
  }

  onSubmit() {
    this.checkinForm.markAllAsTouched();
    if (!this.checkinForm.valid) return;

    const formValue = this.checkinForm.value;
    this.reservationsService.checkinReservation(
      this.reservationId,
      formValue.clientIds ?? [],
      formValue.roomIds ?? []
    ).subscribe(() => {
      this.wasSaved.set(true);
      setTimeout(() => this.wasSaved.set(false), 2000);
      this.router.navigate(['/hotelsession/reservations']);
    });
  }
}
