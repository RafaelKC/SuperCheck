import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Caminhao } from '../../../interfaces/caminhao.interface';

@Component({
  selector: 'app-caminhao-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './caminhao-dialog.component.html',
  styleUrls: ['./caminhao-dialog.component.scss']
})
export class CaminhaoDialogComponent {
  form: FormGroup;
  dialogTitle: string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CaminhaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Caminhao
  ) {
    this.dialogTitle = data ? 'Editar Caminhão' : 'Novo Caminhão';
    this.form = this.formBuilder.group({
      placa: [data?.placa || '', [Validators.required]],
      descricao: [data?.descricao || '', [Validators.required]]
    });

    if (data?.placa != null) this.form.get("placa")?.disable();
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
