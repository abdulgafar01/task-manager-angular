import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Task, TaskStatus } from '../../models/task';
import { TaskService } from '../../task-service';
import { Router } from '@angular/router';
import { CdkDrag, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MatToolbarModule,
    MatIconModule,
    DragDropModule,
    MatCardModule,
    AsyncPipe,
    CdkDrag

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  newTasks$!: Observable<Task[]>;
  inProgress$!: Observable<Task[]>;
  done$!: Observable<Task[]>;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    const tasks$ = this.taskService.getTasks();

    this.newTasks$ = tasks$.pipe(map(ts => ts.filter(t => t.status === 'new')));
    this.inProgress$ = tasks$.pipe(map(ts => ts.filter(t => t.status === 'inprogress')));
    this.done$ = tasks$.pipe(map(ts => ts.filter(t => t.status === 'done')));
  }

  drop(event: CdkDragDrop<Task[]>, targetStatus: TaskStatus) {
    const dragged: Task = event.item.data;
    if (!dragged) return;
    this.taskService.updateTaskStatus(dragged.id, targetStatus);
  }

  goToCreate() {
    this.router.navigate(['/create']);
  }
}
