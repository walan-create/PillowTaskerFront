import { Component } from '@angular/core';
import { HeaderLandingComponent } from './header-landing/header-landing.component';
import { MainLandingComponent } from './main-landing/main-landing.component';
import { FooterLandingComponent } from './footer-landing/footer-landing.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeaderLandingComponent,
    MainLandingComponent,
    FooterLandingComponent
  ],
  template: `
    <app-header-landing></app-header-landing>
    <app-main-landing></app-main-landing>
    <app-footer-landing></app-footer-landing>
  `,
  //Si quisieramos personalizar el html del componente landing, lo hariamos de la siguiente manera:
  //templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
 
}
