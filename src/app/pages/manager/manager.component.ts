import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeService } from '../../services/employee.service';
import { CoreService } from '../../core/core.service';
import { AddEditDialogComponent } from '../../components/add-edit-dialog/add-edit-dialog.component';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatPaginator,
    MatButtonModule,
    MatIcon,

    CommonModule,
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss',
})
export class ManagerComponent implements OnInit {
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'dob',
    'gender',
    'address',
    'phone',
    'salary',
    'action',
  ];

  // We are not going to define any interfaces so we will make type any !
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private _empService: EmployeeService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.getEmployeeList();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddEditDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getEmployeeList();
        }
      },
    });
  }

  getEmployeeList() {
    this._empService.getEmployeeList().subscribe({
      next: (res) => {
        console.log('EMPLOYEE LIST', res);
        // WILL CREATE THE DATA SOURCE FOR US
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openEditDialog(data: any) {
    const dialogRef = this.dialog.open(AddEditDialogComponent, {
        data,
    });

    dialogRef.afterClosed().subscribe({
        next: (val) => {
            if (val) {
                this.getEmployeeList();
            }
        },
    });
}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(data: any) {
    console.log('*****DATA*****', typeof data.id, data.id);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: data.name },
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this._empService.deleteEmployee(data.id).subscribe({
            next: (res) => {
              this._coreService.openSnackBar('Employee Deleted', 'done');
              this.getEmployeeList();
            },
            error: (err) => {
              console.log(err);
            },
          });
        } else {
          this.getEmployeeList();
        }
      },
    });
  }
}
