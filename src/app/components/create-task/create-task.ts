import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TaskService } from '../../task-service';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';





function maxWords(max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const wordCount = control.value.trim().split(/\s+/).filter(Boolean).length;
    return wordCount > max ? { maxWords: { actual: wordCount, max } } : null;
  };
}


@Component({
  selector: 'app-create-task',
  imports: [MatToolbarModule, MatCardModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
})
export class CreateTask {
  form: FormGroup = new FormGroup({
    title: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(20)],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, maxWords(15)],
    }),
  });

  constructor(private taskService: TaskService, private router: Router) { }

  get title() {
    return this.form.get('title');
  }
  get description() {
    return this.form.get('description');
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { title, description } = this.form.value;
    this.taskService.addTask(title!, description!);
    this.router.navigate(['/']);
  }

  goToDashboard() {
  this.router.navigate(['/']);
  }

}
