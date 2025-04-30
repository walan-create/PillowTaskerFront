import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WorkspaceHeaderComponent } from '../../components/workspace-header/workspace-header.component';

@Component({
  selector: 'workspace-layout',
  imports: [RouterOutlet, WorkspaceHeaderComponent],
  templateUrl: './workspace-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkspaceLayoutComponent { }
