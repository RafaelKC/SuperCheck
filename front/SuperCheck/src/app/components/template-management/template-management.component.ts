import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Categoria } from '../../interfaces/categoria.interface';
import { ChecklistTemplate, GetChecklistTemplateListInput } from '../../interfaces/checklist-template.interface';
import { AuthService } from '../../services/auth.service';
import { ChecklistTemplateService } from '../../services/checklist-template.service';

@Component({
  selector: 'app-template-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './template-management.component.html',
  styleUrl: './template-management.component.scss'
})
export class TemplateManagementComponent implements OnInit {
  public displayedColumns: string[] = ['nome', 'categoria', 'acoes'];
  public dataSource: ChecklistTemplate[] = [];
  public totalItems = 0;
  public isLoading = false;
  public isSupervisor = false;

  public filterValue = '';
  public pageSize = 15;
  public currentPage = 0;

  private filterSubject = new Subject<string>();

  constructor(
    private templateService: ChecklistTemplateService,
    private authService: AuthService
  ) {
    this.isSupervisor = this.authService.isSupervisor();
  }

  public ngOnInit() {
    this.setupFilterSubscription();
    this.loadTemplates();
  }

  public getCategoriaDescricao(categoria: Categoria): string {
    return categoria?.descricao || 'N/A';
  }

  public onFilterChange(value: string) {
    this.filterValue = value;
    this.filterSubject.next(value);
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadTemplates();
  }

  public deleteTemplate(id: string) {
    if (confirm('Tem certeza que deseja excluir este template?')) {
      this.templateService.delete(id).subscribe({
        next: () => {
          this.loadTemplates();
        },
        error: (error) => {
          console.error('Error deleting template:', error);
        }
      });
    }
  }

  private setupFilterSubscription() {
    this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadTemplates();
    });
  }

  private loadTemplates() {
    this.isLoading = true;
    const input: GetChecklistTemplateListInput = {
      filter: this.filterValue,
      pageSize: this.pageSize,
      skipCount: this.currentPage * this.pageSize
    };

    this.templateService.getList(input)
      .subscribe({
        next: (result) => {
          this.dataSource = result.items;
          this.totalItems = result.totalCount;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading templates:', error);
          this.isLoading = false;
        }
      });
  }
}
