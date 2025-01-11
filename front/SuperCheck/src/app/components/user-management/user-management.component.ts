import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { GetUsuarioListInput, Usuario, UsuarioRole } from '../../interfaces/usuario.interface';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  public displayedColumns: string[] = ['nome', 'role'];
  public dataSource: Usuario[] = [];
  public totalItems = 0;
  public isLoading = false;

  public filterValue = '';
  public selectedRoles: UsuarioRole[] = [];
  public pageSize = 15;
  public currentPage = 0;

  private filterSubject = new Subject<string>();

  constructor(private usuarioService: UsuarioService) {}
  
  readonly roles = [
    { value: UsuarioRole.Motorista, label: 'Motorista' },
    { value: UsuarioRole.Executor, label: 'Executor' },
    { value: UsuarioRole.Supervisor, label: 'Supervisor' }
  ];

  public ngOnInit() {
    this.setupFilterSubscription();
    this.loadUsers();
  }

  public onFilterChange(value: string) {
    this.filterValue = value;
    this.filterSubject.next(value);
  }

  public onRoleFilterChange() {
    this.currentPage = 0;
    this.loadUsers();
  }

  public onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadUsers();
  }

  public getRoleName(role: UsuarioRole): string {
    return UsuarioRole[role];
  }

  private setupFilterSubscription() {
    this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadUsers();
    });
  }

  private loadUsers() {
    this.isLoading = true;
    const input: GetUsuarioListInput = {
      roles: this.selectedRoles,
      filter: this.filterValue,
      pageSize: this.pageSize,
      skipCount: this.currentPage * this.pageSize
    };

    this.usuarioService.getList(input)
      .subscribe({
        next: (result) => {
          this.dataSource = result.items;
          this.totalItems = result.totalCount;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.isLoading = false;
        }
      });
  }
}
