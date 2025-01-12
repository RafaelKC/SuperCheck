import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reject-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Reprovar Checklist</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <mat-label>Observação</mat-label>
          <textarea matInput formControlName="observacao" rows="4" required></textarea>
          <mat-error *ngIf="form.get('observacao')?.hasError('required')">
            Observação é obrigatória
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="warn" 
              [disabled]="!form.valid"
              (click)="onSubmit()">
        Reprovar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      min-width: 300px;
    }

    mat-dialog-actions {
      padding: 16px 0;
    }
  `]
})
export class RejectDialogComponent {
  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RejectDialogComponent>
  ) {
    this.form = this.fb.group({
      observacao: ['', Validators.required]
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.observacao);
    }
  }
}
