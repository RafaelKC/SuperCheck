import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CategoriaSelectorComponent } from '../shared/categoria-selector/categoria-selector.component';
import { ChecklistService } from '../../services/checklist.service';
import { Checklist } from '../../interfaces/checklist.interface';
import { ChecklistStatus } from '../../interfaces/checklist-status.enum';
import { AuthService } from '../../services/auth.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-checklist-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CategoriaSelectorComponent
  ],
  templateUrl: './checklist-management.component.html',
  styleUrl: './checklist-management.component.scss'
})
export class ChecklistManagementComponent implements OnInit {
  public filterForm: FormGroup;
  public isLoading = false;
  public totalItems = 0;
  public pageSize = 10;
  public currentPage = 0;
  public displayedColumns = ['status', 'observacao', 'data', 'motorista', 'caminhao', 'executor', 'acoes'];
  public dataSource: Checklist[] = [];
  public allStatuses = [
    ChecklistStatus.Aberta,
    ChecklistStatus.EmProgresso,
    ChecklistStatus.Completa,
    ChecklistStatus.Aprovada,
    ChecklistStatus.NaoAprovada,
    ChecklistStatus.Cancelada
  ];
  public selectedStatuses: ChecklistStatus[] = [];
  public isSupervisor = false;

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    private authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      filter: [''],
      data: [null],
      categoriasIds: [[]],
      caminhoesIds: [[]],
      motoristasIds: [[]]
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.currentPage = 0;
        this.loadChecklists();
      });
  }

  ngOnInit() {
    this.isSupervisor = this.authService.hasRole('Supervisor');
    this.loadChecklists();
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadChecklists();
  }

  public onStatusToggle(status: ChecklistStatus) {
    const index = this.selectedStatuses.indexOf(status);
    if (index === -1) {
      this.selectedStatuses.push(status);
    } else {
      this.selectedStatuses.splice(index, 1);
    }
    this.loadChecklists();
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

  public deleteChecklist(id: string) {
    this.isLoading = true;
    this.checklistService.delete(id).subscribe({
      next: () => {
        this.loadChecklists();
      },
      error: (error) => {
        console.error('Error deleting checklist:', error);
        this.isLoading = false;
      }
    });
  }

  private loadChecklists() {
    const input = {
      ...this.filterForm.value,
      pageSize: this.pageSize,
      skipCount: this.currentPage * this.pageSize,
      statuses: this.selectedStatuses.length ? this.selectedStatuses : undefined
    };

    this.checklistService.getList(input).subscribe({
      next: (result) => {
        this.dataSource = result.items;
        this.totalItems = result.totalCount;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading checklists:', error);
        this.isLoading = false;
      }
    });
  }
}
