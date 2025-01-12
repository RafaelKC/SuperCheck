import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChecklistTemplate, CreateUpdateChecklistTemplate } from '../../../interfaces/checklist-template.interface';
import { ChecklistTemplateService } from '../../../services/checklist-template.service';
import { CategoriaSelectorComponent } from '../../shared/categoria-selector/categoria-selector.component';
import { TemplateItemService, TemplateItem } from '../../../services/template-item.service';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    RouterModule,
    DragDropModule,
    CategoriaSelectorComponent,
    MatSnackBarModule
  ],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.scss'
})
export class TemplateFormComponent implements OnInit {
  public form: FormGroup;
  public isLoading = false;
  public isEdit = false;
  public displayedColumns = ['drag', 'nome', 'observacao', 'acoes'];
  public dataSource: FormGroup[] = [];
  public hasChanges = false;
  private templateId: string | null = null;
  private originalItems: TemplateItem[] = [];

  constructor(
    private fb: FormBuilder,
    private templateService: ChecklistTemplateService,
    private templateItemService: TemplateItemService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      categoriaId: ['', [Validators.required]],
      items: this.fb.array([])
    });

    this.form.valueChanges.subscribe(() => {
      this.checkChanges();
    });
  }

  public ngOnInit() {
    this.templateId = this.route.snapshot.paramMap.get('id');
    if (this.templateId) {
      this.isEdit = true;
      this.loadTemplate();
    }
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  get isFormValid(): boolean {
    return this.form.valid && 
           this.hasChanges && 
           this.items.controls.every(control => control.get('nome')?.valid);
  }

  public getItemControl(index: number, controlName: string): FormControl {
    return (this.items.at(index) as FormGroup).get(controlName) as FormControl;
  }

  public onSubmit() {
    if (this.form.valid && this.items.controls.every(control => control.get('nome')?.valid)) {
      this.isLoading = true;
      const { nome, categoriaId } = this.form.value;
      const template: CreateUpdateChecklistTemplate = {
        nome,
        categoriaId,
        id: this.templateId || undefined
      };

      if (this.isEdit && this.templateId) {
        this.templateService.update(this.templateId, template).subscribe({
          next: () => {
            this.saveItems(this.templateId, 'Template atualizado com sucesso!');
          },
          error: (err: unknown) => {
            console.error('Error saving template:', err);
            this.isLoading = false;
          }
        });
      } else {
        this.templateService.create(template).subscribe({
          next: (result: ChecklistTemplate) => {
            this.templateId = result.id;
            this.isEdit = true;
            this.saveItems(result.id, 'Template criado com sucesso!');
          },
          error: (err: unknown) => {
            console.error('Error saving template:', err);
            this.isLoading = false;
          }
        });
      }
    }
  }

  public trackByFn(index: number): number {
    return index;
  }

  public addItem() {
    this.items.push(this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      observacao: ['']
    }));
    this.updateDataSource();
    this.checkChanges();
  }

  private updateDataSource() {
    this.dataSource = [...this.items.controls] as FormGroup[];
  }

  public removeItem(index: number) {
    this.items.removeAt(index);
    this.updateDataSource();
    this.checkChanges();
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items.controls, event.previousIndex, event.currentIndex);
    this.items.updateValueAndValidity();
    this.updateDataSource();
    this.checkChanges();
  }

  private saveItems(templateId: string | null, successMessage: string) {
    if (!templateId) return;
    const items = this.items.controls.map((control, index) => ({
      ...control.value,
      templateId,
      order: index,
      id: control.value.id ?? undefined
    }));

    this.templateItemService.batchUpdate(templateId, { items }).subscribe({
      next: () => {
        this.isLoading = false;
        this.hasChanges = false;
        this.originalItems = [...items];
        this.snackBar.open(successMessage, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end'
        });
      },
      error: (err: unknown) => {
        console.error('Error saving items:', err);
        this.isLoading = false;
      }
    });
  }

  private checkChanges() {
    if (!this.form.dirty && this.items.length === this.originalItems.length) {
      const currentItems = this.items.getRawValue();
      this.hasChanges = currentItems.some((item, index) => {
        const original = this.originalItems[index];
        return !original || 
               item.nome !== original.nome || 
               item.observacao !== original.observacao;
      });
    } else {
      this.hasChanges = true;
    }
  }

  private loadTemplate() {
    if (!this.templateId) {
      return;
    }

    this.isLoading = true;
    
    this.templateService.getById(this.templateId).subscribe({
      next: (template) => {
        this.form.patchValue({
          nome: template.nome,
          categoriaId: template.categoriaId
        });
        
        this.templateItemService.getList(this.templateId!, {
          filter: '',
          pageSize: 100,
          skipCount: 0
        }).subscribe({
          next: (result) => {
            const sortedItems = result.items.sort((a, b) => a.order - b.order);
            this.originalItems = [...sortedItems];
            
            sortedItems.forEach(item => {
              this.items.push(this.fb.group({
                id: [item.id],
                nome: [item.nome, Validators.required],
                observacao: [item.observacao]
              }));
            });
            
            this.updateDataSource();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading items:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading template:', error);
        this.isLoading = false;
      }
    });
  }
}
