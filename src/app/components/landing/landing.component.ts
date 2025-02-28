import { Component } from '@angular/core';
import { HeaderLandingComponent } from './header-landing/header-landing.component';
import { MainLandingComponent } from './main-landing/main-landing.component';
import { FooterLandingComponent } from './footer-landing/footer-landing.component';
import { LoginModalComponent } from '../auth-modals/login-modal/login-modal.component';
import { RegisterModalComponent } from '../auth-modals/register-modal/register-modal.component';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeaderLandingComponent,
    MainLandingComponent,
    FooterLandingComponent,
    RegisterModalComponent,
    LoginModalComponent
  ],
    templateUrl: './landing.component.html',
  //Si quisieramos personalizar el html del componente landing, lo hariamos de la siguiente manera:
  //templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
 
}
