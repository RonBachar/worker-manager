import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  gender: string;
  education: string;
  company: string;
  experience: number;
  salary: number;
}

@Injectable({
  providedIn: 'root',
})

export class EmployeeService {

  private localStorageKey = 'employees';

  constructor() {}

  getEmployeeList(): Observable<Employee[]> {
    const employees = this.getEmployeesFromLocalStorage();
    return of(employees);
  }

  createEmployee(data: Employee): Observable<Employee> {
    const employees = this.getEmployeesFromLocalStorage();
    const id = this.getNextId();
    const employeeWithId = { ...data, id };
    employees.push(employeeWithId);
    this.saveEmployeesToLocalStorage(employees);
    return of(employeeWithId);
  }

  updateEmployee(id: number, data: Employee): Observable<Employee | null> {
    const employees = this.getEmployeesFromLocalStorage();
    const index = employees.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      employees[index] = { ...data, id };
      this.saveEmployeesToLocalStorage(employees);
      return of(employees[index]);
    }
    return of(null);
  }

  deleteEmployee(id: number): Observable<boolean> {
    const employees = this.getEmployeesFromLocalStorage();
    const index = employees.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      employees.splice(index, 1);
      this.saveEmployeesToLocalStorage(employees);
      return of(true);
    }
    return of(false);
  }

  private getEmployeesFromLocalStorage(): Employee[] {
    const employeesJson = localStorage.getItem(this.localStorageKey);
    return employeesJson ? JSON.parse(employeesJson) : [];
  }

  private saveEmployeesToLocalStorage(employees: Employee[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(employees));
  }

  private getNextId(): number {
    const employees = this.getEmployeesFromLocalStorage();
    const maxId = employees.reduce(
      (max, emp) => (emp.id > max ? emp.id : max),
      0
    );
    return maxId + 1;
  }
}
