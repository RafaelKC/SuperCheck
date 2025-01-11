import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../interfaces/categoria.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categoria-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CategoriaSelectorComponent,
      multi: true
    }
  ],
  template: `
    <mat-form-field>
      <mat-label>Categoria</mat-label>
      <mat-select 
        [value]="value"
        (selectionChange)="onChange($event.value)"
        (blur)="onTouched()"
        [disabled]="disabled">
        <mat-option *ngFor="let cat of categorias$ | async" [value]="cat.id">
          {{cat.descricao}}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `]
})
export class CategoriaSelectorComponent implements OnInit, ControlValueAccessor {
  public value: string | null = null;
  public disabled = false;
  public onChange: any = () => {};
  public onTouched: any = () => {};
  public categorias$: Observable<Categoria[]>;

  constructor(private categoriaService: CategoriaService) {
    this.categorias$ = this.categoriaService.categorias$;
  }

  public ngOnInit() {}

  // ControlValueAccessor implementation
  public writeValue(value: string): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
