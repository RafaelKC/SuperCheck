import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {RejectDialogComponent} from './reject-dialog/reject-dialog.component';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import {CategoriaSelectorComponent} from '../../shared/categoria-selector/categoria-selector.component';
import {ChecklistService} from '../../../services/checklist.service';
import {ChecklistItemService} from '../../../services/checklist-item.service';
import {CaminhaoService} from '../../../services/caminhao.service';
import {AuthService} from '../../../services/auth.service';
import {map, Observable} from 'rxjs';
import {Checklist} from '../../../interfaces/checklist.interface';
import {
  BatchUpdateChecklistItemsRequest,
  CreateUpdateChecklistItem
} from '../../../interfaces/checklist-item.interface';
import {ItemStatus} from '../../../interfaces/item-status.enum';
import {GetUsuarioListInput, Usuario, UsuarioRole} from '../../../interfaces/usuario.interface';
import {UsuarioService} from '../../../services/usuario.service';
import {FilteredAndPagedGetListInput} from '../../../interfaces/filtered-and-paged-get-list-input';
import {ChecklistStatus} from '../../../interfaces/checklist-status.enum';
import { Caminhao } from '../../../interfaces/caminhao.interface';

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
  public motoristas$: Observable<Usuario[]>;
  public caminhoes$: Observable<Caminhao[]>;
  public displayedColumns = ['drag', 'nome', 'status', 'observacao', 'acoes'];
  public itemStatuses = [ItemStatus.NaoAvaliada, ItemStatus.Conforme, ItemStatus.NaoConforme, ItemStatus.NaoAplica];
  public isSupervisor = false;
  public isExecutor = false;
  public dataSource: FormGroup[] = [];

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    private checklistItemService: ChecklistItemService,
    private caminhaoService: CaminhaoService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.form = this.fb.group({
      categoriaId: [null],
      caminhaoId: [null, [Validators.required]],
      motoristaId: [null, [Validators.required]],
      data: [new Date(), [Validators.required]],
      observacao: [''],
      items: this.fb.array([])
    });

    this.motoristas$ = this.usuarioService.getList({
      pageSize: 100,
      roles: [UsuarioRole.Motorista]
    } as GetUsuarioListInput).pipe(map(u => u.items));
    this.caminhoes$ = this.caminhaoService.getList({pageSize: 100} as FilteredAndPagedGetListInput).pipe(map(u => u.items));
  }

  ngOnInit() {
    this.isSupervisor = this.authService.hasRole('Supervisor');
    const checklistId = this.route.snapshot.paramMap.get('id');
    if (checklistId) {
      this.loadChecklist(checklistId);
    }
  }

  public get itensValidos(): boolean {
    return this.items.controls.every(c => c.get('status')?.value != ItemStatus.NaoAvaliada);
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
    this.updateDataSource();
    this.form.markAsDirty();
  }

  private updateDataSource() {
    this.dataSource = [...this.items.controls] as FormGroup[];
  }

  public removeItem(index: number) {
    this.items.removeAt(index);
    this.updateDataSource();
  }

  public onDrop(event: CdkDragDrop<string[]>) {
    if (this.checklist?.status !== 0) return;
    
    moveItemInArray(this.items.controls, event.previousIndex, event.currentIndex);
    this.updateDataSource();
    this.form.markAsDirty();
  }

  public onStatusChange(itemId: string, status: ItemStatus) {
    if (!this.checklist || !this.isExecutor) return;

    this.checklistItemService.avaliarItem(itemId, this.checklist.id, status).subscribe({
      next: () => {
        const item = this.items.controls.find(control => control.get('id')?.value === itemId);
        if (item) {
          item.patchValue({status});
        }
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error updating item status:', err);
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

  public getStatusDescricao(status: ItemStatus): string {
    switch (status) {
      case ItemStatus.NaoAvaliada:
        return 'Não avaliada';
      case ItemStatus.Conforme:
        return 'Conforme';
      case ItemStatus.NaoConforme:
        return 'Não conforme';
      case ItemStatus.NaoAplica:
        return 'Não aplica';
    }
  }

  public getStatusClass(status: ChecklistStatus): string {
    switch (status) {
      case ChecklistStatus.Aberta:
        return 'status-aberta';
      case ChecklistStatus.EmProgresso:
        return 'status-em-progresso';
      case ChecklistStatus.Completa:
        return 'status-completa';
      case ChecklistStatus.Aprovada:
        return 'status-aprovada';
      case ChecklistStatus.NaoAprovada:
        return 'status-nao-aprovada';
      case ChecklistStatus.Cancelada:
        return 'status-cancelada';
      default:
        return '';
    }
  }

  public getStatusText(status: ChecklistStatus): string {
    switch (status) {
      case ChecklistStatus.Aberta:
        return 'Aberta';
      case ChecklistStatus.EmProgresso:
        return 'Em Progresso';
      case ChecklistStatus.Completa:
        return 'Completa';
      case ChecklistStatus.Aprovada:
        return 'Aprovada';
      case ChecklistStatus.NaoAprovada:
        return 'Não Aprovada';
      case ChecklistStatus.Cancelada:
        return 'Cancelada';
      default:
        return '';
    }
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


        if (
          this.checklist.status !== ChecklistStatus.Aberta
        ) {
          this.form.disable();
        } else {
          this.form.enable();
        }
        
        if(this.checklist.status !== ChecklistStatus.EmProgresso || !this.isExecutor) {
          this.items.controls.forEach(c => c.get('status')?.disable())
        } else {
          this.items.controls.forEach(c => c.get('status')?.enable())
        }

        this.updateDataSource();
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

    const request: BatchUpdateChecklistItemsRequest = {items};
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
