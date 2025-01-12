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
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FilteredAndPagedGetListInput } from '../../interfaces/filtered-and-paged-get-list-input';
import { CaminhaoService } from '../../services/caminhao.service';
import { Caminhao } from '../../interfaces/caminhao.interface';
import { CaminhaoDialogComponent } from './caminhao-dialog/caminhao-dialog.component';

@Component({
  selector: 'app-caminhao-management',
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
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './caminhao-management.component.html',
  styleUrls: ['./caminhao-management.component.scss']
})
export class CaminhaoManagementComponent implements OnInit {
  public displayedColumns: string[] = ['placa', 'descricao', 'acoes'];
  public dataSource: Caminhao[] = [];
  public totalItems = 0;
  public isLoading = false;

  public filterValue = '';
  public pageSize = 10;
  public currentPage = 0;

  private filterSubject = new Subject<string>();

  constructor(
    private caminhaoService: CaminhaoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  public ngOnInit() {
    this.setupFilterSubscription();
    this.loadCaminhoes();
  }

  public onFilterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterValue = target.value;
    this.filterSubject.next(target.value);
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadCaminhoes();
  }

  public openDialog(caminhao?: Caminhao) {
    const dialogRef = this.dialog.open(CaminhaoDialogComponent, {
      data: caminhao
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        if (caminhao) {
          this.caminhaoService.update(caminhao.id, result)
            .subscribe({
              next: () => {
                this.loadCaminhoes();
              },
              error: (error) => {
                console.error('Error updating caminhao:', error);
                this.isLoading = false;
              }
            });
        } else {
          this.caminhaoService.create(result)
            .subscribe({
              next: () => {
                this.loadCaminhoes();
              },
              error: (error) => {
                console.error('Error creating caminhao:', error);
                this.isLoading = false;
              }
            });
        }
      }
    });
  }

  public deleteCaminhao(caminhao: Caminhao) {
    if (confirm(`Deseja realmente excluir o caminhão ${caminhao.placa}?`)) {
      this.isLoading = true;
      this.caminhaoService.delete(caminhao.id)
        .subscribe({
          next: () => {
            this.loadCaminhoes();
          },
          error: (error) => {
            console.error('Error deleting caminhao:', error);
            this.isLoading = false;
            this.snackBar.open('Não é possível excluir o caminhão pois ele está em uso.', 'Fechar', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
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
      this.loadCaminhoes();
    });
  }

  private loadCaminhoes() {
    this.isLoading = true;
    const input: FilteredAndPagedGetListInput = {
      filter: this.filterValue,
      pageSize: this.pageSize,
      skipCount: this.currentPage * this.pageSize
    };

    this.caminhaoService.getList(input)
      .subscribe({
        next: (result) => {
          this.dataSource = result.items;
          this.totalItems = result.totalCount;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading caminhoes:', error);
          this.isLoading = false;
        }
      });
  }
}
