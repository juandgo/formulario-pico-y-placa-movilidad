import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormularioService } from '../services/formulario.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
  FormsModule,
  FormControl,
} from '@angular/forms';

interface Subtask {
  name: string;
  completed: boolean;
}

interface Month {
  name: string;
  completed: boolean;
  subtasks: Subtask[];
}

// Validator para permitir solo ciertos caracteres en "name"
function validNamePattern(control: AbstractControl): ValidationErrors | null {
  const valid = /^[a-zA-Z0-9\s]+$/.test(control.value);
  return valid ? null : { pattern: true };
}

// Validator para formato de placa AAA-111
function plateFormatValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^[A-Z]{3}-\d{3}$/.test(control.value);
  return valid ? null : { pattern: true };
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule
  ],
})
export class FormularioComponent implements OnInit {
  form!: FormGroup;

  months: Month[] = [
    {
      name: 'Enero',
      completed: false,
      subtasks: [
        { name: 'Subtarea 1', completed: false },
        { name: 'Subtarea 2', completed: false },
        { name: 'Subtarea 2', completed: false },
        { name: 'Subtarea 2', completed: false },
      ],
    },
    {
      name: 'Febrero',
      completed: false,
      subtasks: [
        { name: 'Subtarea 1', completed: false },
        { name: 'Subtarea 1', completed: false },
        { name: 'Subtarea 1', completed: false },
        { name: 'Subtarea 2', completed: false },
      ],
    },
    {
      name: 'Marzo',
      completed: false,
      subtasks: [
        { name: 'Subtarea 1', completed: false },
        { name: 'Subtarea 1', completed: false },
        { name: 'Subtarea 1', completed: false },
        { name: 'Subtarea 2', completed: false },
      ],
    },
    {
      name: 'Abril',
      completed: false,
      subtasks: [
        { name: 'Subtarea 1', completed: false },
        { name: 'Subtarea 2', completed: false },
        { name: 'Subtarea 2', completed: false },
        { name: 'Subtarea 2', completed: false },
      ],
    },
    // puedes agregar más meses
  ];

  constructor(
    private fb: FormBuilder,
    private formularioService: FormularioService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(10), validNamePattern]],
      type_doc: ['', Validators.required],
      doc_number: ['', Validators.required],
      dv: [''],
      phone: [''],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      brand: [''],
      model: [''],
      plate: ['', [Validators.required, Validators.maxLength(7), plateFormatValidator]],
      type_vehicle: [''],
      observations: [''],
      total: ['', Validators.required],
      months: this.fb.array(this.months.map(month => this.createMonthGroup(month)))
    });
  }

  createMonthGroup(month: Month): FormGroup {
    return this.fb.group({
      completed: [month.completed],
      subtasks: this.fb.array(month.subtasks.map(subtask => this.fb.control(subtask.completed)))
    });
  }

  get monthsArray(): FormArray {
    return this.form.get('months') as FormArray;
  }

  get nameField() {
    return this.form.get('name');
  }

  get emailField() {
    return this.form.get('email');
  }

  get plateField() {
    return this.form.get('plate');
  }
  getSubtasksControls(monthGroup: AbstractControl): FormControl[] {
    return (monthGroup.get('subtasks') as FormArray).controls as FormControl[];
  }

  getMonthGroup(index: number): FormGroup {
    return this.monthsArray.at(index) as FormGroup;
  }


  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase().slice(0, 7);
    this.form.get('plate')?.setValue(input.value, { emitEvent: false });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Formulario válido:', this.form.value);
  }

  onMesSeleccionado(index: number): void {
    const monthGroup = this.monthsArray.at(index);
    const completed = monthGroup.get('completed')?.value;
    console.log(`Mes ${this.months[index].name} seleccionado: ${completed}`);

    const subtasks = monthGroup.get('subtasks') as FormArray;

    subtasks.controls.forEach(control => {
      control.setValue(completed);
    });
  }


  updateSubtask(monthIndex: number, subtaskIndex: number, value: boolean) {
    const subtasksArray = (this.monthsArray.at(monthIndex).get('subtasks') as FormArray);
    subtasksArray.at(subtaskIndex).setValue(value);
  }

  // onSubmit(): void {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }

  //   const formData = this.form.value;

  //   this.formularioService.enviarFormulario(formData).subscribe({
  //     next: response => {
  //       console.log('Respuesta del servidor:', response);
  //     },
  //     error: err => {
  //       console.error('Error al enviar formulario:', err);
  //     }
  //   });
  // }
}
