// src/app/services/notification.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public errorMessage = signal<string | null>(null);

  showError(message: string) {
    this.errorMessage.set(message);
    setTimeout(() => this.clearError(), 4000); // Limpia automáticamente
  }

  clearError() {
    this.errorMessage.set(null);
  }

  getError() {
    return this.errorMessage.asReadonly(); // Permite suscripción reactiva
  }
}
