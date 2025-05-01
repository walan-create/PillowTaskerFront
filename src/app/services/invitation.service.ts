import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Invitation } from '../workspace/interfaces/invitation.interface';
import { AuthService } from '@auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  private baseUrl = environment.baseUrl;
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  invitations = signal<Invitation[]>([]); // Aqui se tienen que guardar todas las invitaciones devueltas

  getInvitationsByEmail(mail: string): Observable<Invitation[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/users/invitations/mail/${mail}`)
      .pipe(
        map((response) =>
          response
            .map((invitation) => ({
              id: invitation.id,
              mail: invitation.mail,
              state: invitation.state,
              shippingDate: invitation.shippingDate,
              hotelName: invitation.hotel.name,
              credentialType: invitation.credentialType,
            }))
            .sort(
              (a, b) =>
                new Date(b.shippingDate).getTime() -
                new Date(a.shippingDate).getTime()
            )
        ),
        tap((invitations) => {
          // Guardar en localStorage
          this.invitations.set(invitations);
          localStorage.setItem('userInvitations', JSON.stringify(invitations));
        }),
        catchError((error) => {
          console.log('Error al cargar las invitaciones');
          return of([]); // Devuelve un array vacío para que no rompa el flujo
        })
      );
  }

  loadUserInvitations(): Observable<Invitation[]> {
    const user = this.authService.user()!;
    const userMail = user.mail;

    return this.getInvitationsByEmail(userMail);
  }

  getLocalInvitations(): Invitation[] {
    const stored = localStorage.getItem('userInvitations');
    return stored ? JSON.parse(stored) : [];
  }

  respondToInvitation(invitationId: number, accepted: boolean, password: string): Observable<void> {
    const body = { accepted, password };

    return this.http
      .patch<void>(`${this.baseUrl}/users/invitations/${invitationId}/respond`, body)
      .pipe(
        tap(() => {
          this.invitations.update((invitations) =>
            invitations.filter((invitation) => invitation.id !== invitationId)
          );
          localStorage.setItem(
            'userInvitations',
            JSON.stringify(this.invitations())
          );
        })
      );
  }
  
}
