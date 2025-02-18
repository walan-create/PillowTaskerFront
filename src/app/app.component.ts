import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLandingComponent } from "./components/header-landing/header-landing.component";
import { FooterLandingComponent } from "./components/footer-landing/footer-landing.component";
import { MainLandingComponent } from "./components/main-landing/main-landing.component";
import { HeaderWorkspaceComponent } from "./components/header-workspace/header-workspace.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderLandingComponent, FooterLandingComponent, MainLandingComponent, HeaderWorkspaceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PillowTaskerFront';
}
