import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; // Ensure ReactiveFormsModule is imported

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list'; // Import this module
import { MatGridTile } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Import MatCheckboxModule

interface Subtask {
  name: string;
  completed: boolean;
}

interface Task {
  name: string;
  completed: boolean;
  subtasks: Subtask[];
}

@Component({
  selector: 'app-formulario',
  standalone: true,
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatGridListModule,
    MatGridTile,
  ],
})
export class FormularioComponent implements OnInit {
  // form = new FormGroup({});
  form!: FormGroup;
  plate: string = '';
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.plate = input.value.toUpperCase();
    input.value = this.plate;  // actualiza el valor mostrado en el input
  }
  months = [
    'ENE',
    'FEB',
    'MAR',
    'ABR',
    'MAY',
    'JUN',
    'JUL',
    'AGO',
    'SEP',
    'OCT',
    'NOV',
    'DIC',
  ];
  // anioSeleccionado = 2025;
  tasks: Task[] = [];
  mesesSeleccionados: { [key: string]: boolean } = {};
  anioSeleccionado: boolean = false;

  // get habilitarCheckBoxes(): boolean {
  //   return this.plate.trim().length > 0;
  // }

  // Fechas disponibles por mes (puedes modificar las fechas según tus reglas de negocio)
  fechasPorMes: { [key: string]: string[] } = {
    ENE: ['2025-01-05', '2025-01-12', '2025-01-19', '2025-01-26'],
    FEB: ['2025-02-02', '2025-02-09', '2025-02-16', '2025-02-23'],
    MAR: ['2025-02-02', '2025-02-09', '2025-02-16', '2025-02-23'],
    ABR: ['2025-02-02', '2025-02-09', '2025-02-16', '2025-02-23'],
    MAY: ['2025-02-02', '2025-02-09', '2025-02-16', '2025-02-23'],
    // ... continúa para los demás meses
  };

  // Fechas visibles actualmente (según el mes seleccionado)
  fechasVisibles: string[] = [];

  // onMesSeleccionado(month: string): void {
  //   if (this.mesesSeleccionados[month]) {
  //     this.fechasVisibles = this.fechasPorMes[month];
  //   } else {
  //     this.fechasVisibles = [];
  //   }
  // }

  fechasSeleccionadas: { [key: string]: boolean } = {};


  constructor(private formBuilder: FormBuilder) {
    this.months.forEach(month => this.mesesSeleccionados[month] = false);
    this.buildForm();
  }

  ngOnInit(): void {
    // this.months.forEach(month => this.mesesSeleccionados[month] = false);
    // this.form.get('plate')?.valueChanges.subscribe(value => {
    //   this.plate = value;
    //   if (this.habilitarCheckBoxes) {
    //     this.months.forEach(month => this.mesesSeleccionados[month] = true);
    //   } else {
    //     this.months.forEach(month => this.mesesSeleccionados[month] = false);
    //   }
    // });
  }

  getNameValue() {
    console.log(this.nameField?.value);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^[a-zA-Z ]+$/),
        ],
      ],
      type_doc: ['', [Validators.required]],
      doc_number: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      dv: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      phone: ['', Validators.required],
      address: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9 ]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      plate: [
        '',
        [Validators.required, Validators.pattern("^[A-Z]{3}-?\\d{3}$")],
      ],
      brand: [''],
      model: [''],
      date: [''],
      month: ['', [Validators.required]],
      year: ['', [Validators.required]],
      type_vehicle: ['', [Validators.required]],
      observations: [''],
      total_to_pay: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  get isNameFieldValid() {
    return this.nameField?.touched && this.nameField.valid;
  }
  get isNameFieldInvalid() {
    return this.nameField?.touched && this.nameField.invalid;
  }

  get nameField() {
    return this.form.get('name');
  }
  get tipoDocField() {
    return this.form.get('type_doc');
  }
  get docNumberField() {
    return this.form.get('doc_number');
  }
  get emailField() {
    return this.form?.get('email');
  }

  get plateField() {
    return this.form.get('plate');
  }

  get phoneField() {
    return this.form.get('phone');
  }

  get addressField() {
    return this.form.get('address');
  }

  get dvField() {
    return this.form.get('dv');
  }

  get monthField() {
    return this.form.get('month');
  }

  get yearField() {
    return this.form.get('year');
  }

  get typeVehicleField() {
    return this.form.get('type_vehicle');
  }

  get observationsField() {
    return this.form.get('observations');
  }

  get totalToPayField() {
    return this.form.get('total_to_pay');
  }

  get isFormValid() {
    return this.form.valid;
  }

  get isFormInvalid() {
    return this.form.invalid;
  }

  private _task: Task = {
    name: 'Enero 2025',
    completed: false,
    subtasks: [
      { name: '03/01/2025', completed: false },
      { name: '10/01/2025', completed: false },
      { name: '17/01/2025', completed: false },
      { name: '20/01/2025', completed: false },
    ],
  };

  task(): Task {
    return this._task;
  }

  partiallyComplete(): boolean {
    const completedCount = this._task.subtasks.filter(
      (t) => t.completed
    ).length;
    return completedCount > 0 && completedCount < this._task.subtasks.length;
  }

  update(completed: boolean, index?: number): void {
    if (index === undefined) {
      this._task.completed = completed;
      this._task.subtasks.forEach((t) => (t.completed = completed));
    } else {
      this._task.subtasks[index].completed = completed;
      this._task.completed = this._task.subtasks.every((t) => t.completed);
    }
  }

  toggleSeleccionAnio(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.anioSeleccionado = checked;

    // Selecciona o deselecciona todos los meses
    this.months.forEach(month => {
      this.mesesSeleccionados[month] = checked;
    });
  }

  private obtenerLunesDelMes(mes: string, anio: number): string[] {
    const mesesIndice: { [key: string]: number } = {
      ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
      JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11
    };

    const indexMes = mesesIndice[mes];
    const lunes: string[] = [];

    const fecha = new Date(anio, indexMes, 1);
    while (fecha.getMonth() === indexMes) {
      if (fecha.getDay() === 1) { // Lunes
        const dia = fecha.toISOString().split('T')[0];
        lunes.push(dia);
      }
      fecha.setDate(fecha.getDate() + 1);
    }

    return lunes;
  }


  onMesSeleccionado(month: string): void {
    this.mesesSeleccionados[month] = !this.mesesSeleccionados[month];

    if (this.mesesSeleccionados[month]) {
      const lunes = this.obtenerLunesDelMes(month, Number(this.yearField?.value || new Date().getFullYear()));

      const nuevaTarea: Task = {
        name: `${month} ${this.yearField?.value || ''}`,
        completed: false,
        subtasks: lunes.map(dia => ({
          name: dia,
          completed: false
        }))
      };

      this.tasks.push(nuevaTarea);
    } else {
      // Si se deselecciona el mes, se elimina la tarea correspondiente
      this.tasks = this.tasks.filter(t => !t.name.startsWith(month));
    }
  }

  toggleTaskCompletion(task: Task): void {
    const completed = !task.completed;
    task.completed = completed;
    task.subtasks.forEach(subtask => subtask.completed = completed);
  }

  toggleSubtaskCompletion(task: Task, subtask: Subtask): void {
    subtask.completed = !subtask.completed;
    task.completed = task.subtasks.every(t => t.completed);
  }

  isTaskIndeterminate(task: Task): boolean {
    return task.subtasks.some(t => t.completed) && !task.subtasks.every(t => t.completed);
  }


}
