import { Injectable } from '@angular/core';
import { Task, TaskStatus } from './models/task';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
   private readonly storageKey = 'tm_tasks_v1';
  private tasks$ = new BehaviorSubject<Task[]>(this.load());
    getTasks(): Observable<Task[]> {
    return this.tasks$.asObservable();
  }

  getSnapshot(): Task[] {
    return this.tasks$.getValue();
  }

  addTask(title: string, description: string) {
    const t: Task = {
      id: uuidv4(),
      title,
      description,
      status: 'new',
      createdAt: Date.now()
    };
    const updated = [t, ...this.getSnapshot()];
    this.tasks$.next(updated);
    this.save(updated);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const updated = this.getSnapshot().map(t => t.id === id ? {...t, status} : t);
    this.tasks$.next(updated);
    this.save(updated);
  }

  //  Update an existing task (title/description/status)
  // commented out the updateTask method as it is not used currently
  // updateTask(id: string, updatedFields: Partial<Task>) {
  //   const updated = this.getSnapshot().map((t) =>
  //     t.id === id ? { ...t, ...updatedFields } : t
  //   );
  //   this.tasks$.next(updated);
  //   this.save(updated);
  // }

  //  Delete a task
  deleteTask(id: string) {
    const updated = this.getSnapshot().filter((t) => t.id !== id);
    this.tasks$.next(updated);
    this.save(updated);
  }

  private load(): Task[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      return JSON.parse(raw) as Task[];
    } catch {
      return [];
    }
  }

  private save(tasks: Task[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }
}



 

