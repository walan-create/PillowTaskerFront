import { Component } from '@angular/core';
import { HeaderWorkspaceComponent } from './header-workspace/header-workspace.component';
import { HomeComponent } from './home/home.component';
import { HotelsComponent } from './hotels/hotels.component';
import { InvitationsComponent } from './invitations/invitations.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderWorkspaceComponent,
    HomeComponent,
    HotelsComponent,
    InvitationsComponent,
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss'
})
export class WorkspaceComponent {

}
