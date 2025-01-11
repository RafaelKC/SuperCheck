import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CategoriaDialogComponent } from './categoria-dialog/categoria-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FilteredAndPagedGetListInput } from '../../interfaces/filtered-and-paged-get-list-input';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../interfaces/categoria.interface';

@Component({
  selector: 'app-categoria-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './categoria-management.component.html',
  styleUrls: ['./categoria-management.component.scss']
})
export class CategoriaManagementComponent implements OnInit {
  public displayedColumns: string[] = ['nome', 'acoes'];
  public dataSource: Categoria[] = [];
  public totalItems = 0;
  public isLoading = false;

  public filterValue = '';
  public pageSize = 10;
  public currentPage = 0;

  private filterSubject = new Subject<string>();

  constructor(
    private categoriaService: CategoriaService,
    private dialog: MatDialog
  ) {}

  public ngOnInit() {
    this.setupFilterSubscription();
    this.loadCategorias();
  }

  public onFilterChange(value: string) {
    this.filterValue = value;
    this.filterSubject.next(value);
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadCategorias();
  }

  public openDialog(categoria?: Categoria) {
    const dialogRef = this.dialog.open(CategoriaDialogComponent, {
      data: categoria
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        if (categoria) {
          this.categoriaService.update(categoria.id, result)
            .subscribe({
              next: () => {
                this.loadCategorias();
              },
              error: (error) => {
                console.error('Error updating categoria:', error);
                this.isLoading = false;
              }
            });
        } else {
          this.categoriaService.create(result)
            .subscribe({
              next: () => {
                this.loadCategorias();
              },
              error: (error) => {
                console.error('Error creating categoria:', error);
                this.isLoading = false;
              }
            });
        }
      }
    });
  }

  public deleteCategoria(categoria: Categoria) {
    if (confirm(`Deseja realmente excluir a categoria ${categoria.descricao}?`)) {
      this.isLoading = true;
      this.categoriaService.delete(categoria.id)
        .subscribe({
          next: () => {
            this.loadCategorias();
          },
          error: (error) => {
            console.error('Error deleting categoria:', error);
            this.isLoading = false;
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
      this.loadCategorias();
    });
  }

  private loadCategorias() {
    this.isLoading = true;
    const input: FilteredAndPagedGetListInput = {
      filter: this.filterValue,
      pageSize: this.pageSize,
      skipCount: this.currentPage * this.pageSize
    };

    this.categoriaService.getList(input)
      .subscribe({
        next: (result) => {
          this.dataSource = result.items;
          this.totalItems = result.totalCount;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading categorias:', error);
          this.isLoading = false;
        }
      });
  }
}
