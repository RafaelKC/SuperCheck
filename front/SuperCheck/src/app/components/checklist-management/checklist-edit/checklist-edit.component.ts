import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RejectDialogComponent } from './reject-dialog/reject-dialog.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CategoriaSelectorComponent } from '../../shared/categoria-selector/categoria-selector.component';
import { ChecklistService } from '../../../services/checklist.service';
import { ChecklistItemService } from '../../../services/checklist-item.service';
import { MotoristaService, Motorista } from '../../../services/motorista.service';
import { CaminhaoService, Caminhao } from '../../../services/caminhao.service';
import { AuthService } from '../../../services/auth.service';
import { Observable, forkJoin, map } from 'rxjs';
import { Checklist } from '../../../interfaces/checklist.interface';
import { ChecklistItem, CreateUpdateChecklistItem, BatchUpdateChecklistItemsRequest } from '../../../interfaces/checklist-item.interface';
import { ChecklistStatus } from '../../../interfaces/checklist-status.enum';
import { ItemStatus } from '../../../interfaces/item-status.enum';

@Component({
  selector: 'app-checklist-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    RouterModule,
    DragDropModule,
    CategoriaSelectorComponent
  ],
  templateUrl: './checklist-edit.component.html',
  styleUrl: './checklist-edit.component.scss'
})
export class ChecklistEditComponent implements OnInit {
  public form: FormGroup;
  public isLoading = false;
  public checklist: Checklist | null = null;
  public motoristas$: Observable<Motorista[]>;
  public caminhoes$: Observable<Caminhao[]>;
  public displayedColumns = ['drag', 'nome', 'status', 'observacao', 'acoes'];
  public itemStatuses = Object.values(ItemStatus);
  public isSupervisor = false;
  public isExecutor = false;

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService,
    private motoristaService: MotoristaService,
    private caminhaoService: CaminhaoService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      categoriaId: [null, [Validators.required]],
      caminhaoId: [null, [Validators.required]],
      motoristaId: [null, [Validators.required]],
      data: [new Date(), [Validators.required]],
      observacao: [''],
      items: this.fb.array([])
    });

    this.motoristas$ = this.motoristaService.getList();
    this.caminhoes$ = this.caminhaoService.getList();
  }

  ngOnInit() {
    this.isSupervisor = this.authService.hasRole('Supervisor');
    const checklistId = this.route.snapshot.paramMap.get('id');
    if (checklistId) {
      this.loadChecklist(checklistId);
    }
  }

  get items() {
    return this.form.get('items') as FormArray;
  }

  public onSubmit() {
    if (this.form.valid && this.checklist) {
      this.isLoading = true;
      this.checklistService.update(this.checklist.id, this.form.value).subscribe({
        next: () => {
          this.saveItems();
        },
        error: (err: unknown) => {
          console.error('Error updating checklist:', err);
          this.isLoading = false;
        }
      });
    }
  }

  public addItem() {
    this.items.push(this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      observacao: [''],
      status: [ItemStatus.NaoAvaliada]
    }));
  }

  public removeItem(index: number) {
    this.items.removeAt(index);
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items.controls, event.previousIndex, event.currentIndex);
    this.items.updateValueAndValidity();
  }

  public onStatusChange(itemId: string, status: ItemStatus) {
    if (!this.checklist || !this.isExecutor) return;

    this.isLoading = true;
    this.checklistItemService.avaliarItem(itemId, status).subscribe({
      next: () => {
        const item = this.items.controls.find(control => control.get('id')?.value === itemId);
        if (item) {
          item.patchValue({ status });
        }
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error updating item status:', err);
        this.isLoading = false;
      }
    });
  }

  public iniciarExecucao() {
    if (!this.checklist) return;
    this.isLoading = true;
    this.checklistService.iniciarExecucao(this.checklist.id).subscribe({
      next: () => {
        this.loadChecklist(this.checklist!.id);
      },
      error: (err: unknown) => {
        console.error('Error starting checklist:', err);
        this.isLoading = false;
      }
    });
  }

  public finalizar() {
    if (!this.checklist) return;
    this.isLoading = true;
    this.checklistService.finalizar(this.checklist.id).subscribe({
      next: () => {
        this.loadChecklist(this.checklist!.id);
      },
      error: (err: unknown) => {
        console.error('Error finishing checklist:', err);
        this.isLoading = false;
      }
    });
  }

  public aprovar() {
    if (!this.checklist) return;
    this.isLoading = true;
    this.checklistService.aprovar(this.checklist.id).subscribe({
      next: () => {
        this.loadChecklist(this.checklist!.id);
      },
      error: (err: unknown) => {
        console.error('Error approving checklist:', err);
        this.isLoading = false;
      }
    });
  }

  public reprovar() {
    if (!this.checklist) return;
    
    const dialogRef = this.dialog.open(RejectDialogComponent);
    dialogRef.afterClosed().subscribe(observacao => {
      if (!observacao) return;

      this.isLoading = true;
      this.checklistService.reprovar(this.checklist!.id, observacao).subscribe({
        next: () => {
          this.loadChecklist(this.checklist!.id);
        },
        error: (err: unknown) => {
          console.error('Error rejecting checklist:', err);
          this.isLoading = false;
        }
      });
    });
  }

  public cancelar() {
    if (!this.checklist) return;
    this.isLoading = true;
    this.checklistService.cancelar(this.checklist.id).subscribe({
      next: () => {
        this.loadChecklist(this.checklist!.id);
      },
      error: (err: unknown) => {
        console.error('Error canceling checklist:', err);
        this.isLoading = false;
      }
    });
  }

  public reabrir() {
    if (!this.checklist) return;
    this.isLoading = true;
    this.checklistService.reabrir(this.checklist.id).subscribe({
      next: () => {
        this.loadChecklist(this.checklist!.id);
      },
      error: (err: unknown) => {
        console.error('Error reopening checklist:', err);
        this.isLoading = false;
      }
    });
  }

  private loadChecklist(id: string) {
    this.isLoading = true;
    this.checklistService.getById(id).subscribe({
      next: (checklist) => {
        this.checklist = checklist;
        this.isExecutor = this.authService.getCurrentUser()?.id === checklist.executorId;

        this.form.patchValue({
          categoriaId: checklist.categoriaId,
          caminhaoId: checklist.caminhaoId,
          motoristaId: checklist.motoristaId,
          data: checklist.data,
          observacao: checklist.observacao
        });

        // Clear and rebuild items array
        while (this.items.length) {
          this.items.removeAt(0);
        }

        checklist.items.sort((a, b) => a.order - b.order).forEach(item => {
          this.items.push(this.fb.group({
            id: [item.id],
            nome: [item.nome, Validators.required],
            observacao: [item.observacao],
            status: [item.status]
          }));
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading checklist:', error);
        this.isLoading = false;
      }
    });
  }

  private saveItems() {
    if (!this.checklist) return;

    const items: CreateUpdateChecklistItem[] = this.items.controls.map((control, index) => ({
      ...control.value,
      checklistId: this.checklist!.id,
      order: index
    }));

    const request: BatchUpdateChecklistItemsRequest = { items };
    this.checklistItemService.batchUpdate(this.checklist.id, request).subscribe({
      next: () => {
        this.loadChecklist(this.checklist!.id);
      },
      error: (err: unknown) => {
        console.error('Error saving items:', err);
        this.isLoading = false;
      }
    });
  }
}
