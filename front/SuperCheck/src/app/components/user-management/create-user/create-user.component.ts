import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { CreateMotoristaInput, CreateUsuarioInput } from '../../../interfaces/usuario-create.interface';
import { UsuarioRole } from '../../../interfaces/usuario.interface';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="create-user-container">
      <h2>{{ isMotorista ? 'Adicionar Motorista' : 'Adicionar Usuário' }}</h2>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field>
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome" required>
        </mat-form-field>

        <ng-container *ngIf="!isMotorista">
          <mat-form-field>
            <mat-label>Role</mat-label>
            <mat-select formControlName="role" required>
              <mat-option [value]="roles.Executor">Executor</mat-option>
              <mat-option [value]="roles.Supervisor">Supervisor</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Login</mat-label>
            <input matInput formControlName="login" required>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Senha</mat-label>
            <input matInput type="password" formControlName="senha" required>
          </mat-form-field>
        </ng-container>

        <div class="actions">
          <button mat-button type="button" (click)="onCancel()">Cancelar</button>
          <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
            Salvar
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .create-user-container {
      padding: 20px;
      max-width: 500px;
      margin: 0 auto;

      h2 {
        margin-bottom: 20px;
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .actions {
        display: flex;
        gap: 16px;
        justify-content: flex-end;
        margin-top: 20px;
      }
    }
  `]
})
export class CreateUserComponent implements OnInit {
  form!: FormGroup;
  isMotorista = false;
  roles = UsuarioRole;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isMotorista = this.route.snapshot.data['type'] === 'motorista';
    this.initForm();
  }

  private initForm() {
    if (this.isMotorista) {
      this.form = this.fb.group({
        nome: ['', Validators.required]
      });
    } else {
      this.form = this.fb.group({
        nome: ['', Validators.required],
        role: ['', Validators.required],
        login: ['', Validators.required],
        senha: ['', Validators.required]
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.isMotorista) {
        const input: CreateMotoristaInput = {
          nome: this.form.value.nome
        };
        this.usuarioService.createMotorista(input).subscribe({
          next: () => this.onSuccess(),
          error: (error) => console.error('Error creating motorista:', error)
        });
      } else {
        const input: CreateUsuarioInput = {
          nome: this.form.value.nome,
          role: this.form.value.role,
          credential: {
            login: this.form.value.login,
            password: this.form.value.senha
          }
        };
        this.usuarioService.createUsuario(input).subscribe({
          next: () => this.onSuccess(),
          error: (error) => console.error('Error creating user:', error)
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private onSuccess() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
