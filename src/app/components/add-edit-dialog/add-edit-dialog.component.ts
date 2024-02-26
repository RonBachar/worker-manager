import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { CoreService } from '../../core/core.service';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-add-edit-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatFormField,
    MatLabel,
    MatDialogContent,
    MatDialogActions,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatInputModule,
    MatDialogModule,
    MatButton,
    MatSelectModule
  ],
  templateUrl: './add-edit-dialog.component.html',
  styleUrl: './add-edit-dialog.component.scss',
  providers: [provideNativeDateAdapter()],
})

export class AddEditDialogComponent implements OnInit {
  _empForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<AddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService
  ) {
    this._empForm = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      salary: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this._empForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this._empForm.valid) {
        if (this.data) {
            this._empService
                .updateEmployee(this.data.id, this._empForm.value)
                .subscribe({
                    next: (val: any) => {
                        this._coreService.openSnackBar(
                            'Employee Details updated'
                        );
                        this._dialogRef.close(true);
                    },
                    error: (err: any) => {
                        console.log(err);
                    },
                });
        } else {
            // if the form is valid and it is adding new client lets call the add employee service
            this._empService.createEmployee(this._empForm.value).subscribe({
                next: (val: any) => {
                    this._coreService.openSnackBar(
                        'Employee Added Successfuly'
                    );

                    this._dialogRef.close(true);
                },
                error: (err: any) => {
                    console.log(err);
                },
            });
        }
    }
}
}
