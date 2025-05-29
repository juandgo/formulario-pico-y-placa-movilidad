import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormularioService } from '../services/formulario.service';
import Holidays from 'date-holidays';
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
  disabled?: boolean; // ← Nuevo
}

interface Month {
  name: string;
  index: number; // ← Nuevo para identificar el mes
  completed: boolean;
  fechas: Subtask[];
  disabled?: boolean;
}

function validNamePattern(control: AbstractControl): ValidationErrors | null {
  const valid = /^[a-zA-Z0-9\s]+$/.test(control.value);
  return valid ? null : { pattern: true };
}

function plateFormatValidator(
  control: AbstractControl
): ValidationErrors | null {
  const valid = /^[A-Z]{3}-\d{3}$/.test(control.value);
  return valid ? null : { pattern: true };
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatCheckboxModule],
})
export class FormularioComponent implements OnInit {
  form!: FormGroup;
  hd!: Holidays;
  months: Month[] = [];

  readonly picoYPlacaDias: { [key: string]: number } = {
    '5': 1,
    '6': 1,
    '7': 2,
    '8': 2,
    '9': 3,
    '0': 3,
    '1': 4,
    '2': 4,
    '3': 5,
    '4': 5,
  };

  // months: Month[] = [
  //   'Enero',
  //   'Febrero',
  //   'Marzo',
  //   'Abril',
  //   'Mayo',
  //   'Junio',
  //   'Julio',
  //   'Agosto',
  //   'Septiembre',
  //   'Octubre',
  //   'Noviembre',
  //   'Diciembre',
  // ].map((name) => ({ name, completed: false, fechas: [] }));

  constructor(
    private fb: FormBuilder,
    private formularioService: FormularioService
  ) {}

  ngOnInit(): void {
    // const currentMonth = new Date().getMonth(); // 0 = Enero
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    this.months = monthNames
      .map((name, index) => ({
        name,
        index,
        completed: false,
        fechas: [],
        disabled: false, // ya no necesitamos marcarlos como deshabilitados si los filtramos
      }))
      .filter((_, index) => index >= currentMonth); // ← Oculta los meses anteriores

    this.hd = new Holidays('CO'); // CO = Colombia
    this.form = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.maxLength(10), validNamePattern],
      ],
      type_doc: ['', Validators.required],
      doc_number: ['', Validators.required],
      dv: [''],
      phone: [''],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      brand: [''],
      model: [''],
      plate: [
        '',
        [Validators.required, Validators.maxLength(7), plateFormatValidator],
      ],
      type_vehicle: [''],
      observations: [''],
      total: ['', Validators.required],
      months: this.fb.array(
        this.months.map((month) => this.createMonthGroup(month))
      ),
    });

    this.form.get('plate')?.valueChanges.subscribe((value) => {
      if (this.plateField?.valid) {
        const lastDigit = value.trim().slice(-1);
        const dia = this.picoYPlacaDias[lastDigit];

        if (dia !== undefined) {
          const fechas = this.getPicoYPlacaDates(dia);
          this.updateMonthSubtasks(fechas);
        }
      }
    });

    // this.obtenerDatos();
  }

  // Inicialización de Meses y Fechas
  createMonthGroup(month: Month): FormGroup {
    return this.fb.group({
      completed: new FormControl({
        value: month.completed,
        disabled: month.disabled || false,
      }),
      fechas: this.fb.array(
        month.fechas.map(
          (subtask) =>
            new FormControl({
              value: subtask.completed,
              disabled: !!subtask.disabled,
            })
        )
      ),
    });
  }

  updateMonthSubtasks(fechas: string[][]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.months.forEach((month, i) => {
      const monthIndex = month.index;
      const fechasMes =
        fechas[monthIndex]?.map((dateStr) => {
          const date = new Date(dateStr);
          date.setHours(0, 0, 0, 0);
          return {
            name: dateStr,
            completed: false,
            disabled: date < today,
          };
        }) || [];

      // Actualiza objeto de estado
      month.fechas = fechasMes;
      month.disabled = fechasMes.every((st) => st.disabled);

      // Actualiza formulario reactivo
      const monthGroup = this.getMonthGroup(i);
      const fechasArray = monthGroup.get('fechas') as FormArray;

      // Limpia y vuelve a cargar el FormArray
      fechasArray.clear();
      fechasMes.forEach((f) => {
        fechasArray.push(
          new FormControl({ value: false, disabled: f.disabled })
        );
      });

      const completedCtrl = monthGroup.get('completed');
      completedCtrl?.disable({ onlySelf: true });
      if (!month.disabled) {
        completedCtrl?.enable({ onlySelf: true });
      }
    });
  }

  getPicoYPlacaDates(dia: number): string[][] {
    const year = new Date().getFullYear();
    const fechasPorMes: string[][] = [];

    for (let mes = 0; mes < 12; mes++) {
      const fechas: string[] = [];
      const daysInMonth = new Date(year, mes + 1, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, mes, day);
        date.setHours(0, 0, 0, 0);

        if (date.getDay() === dia && !this.hd.isHoliday(date)) {
          fechas.push(date.toLocaleDateString('sv-SE'));
        }
      }

      fechasPorMes.push(fechas);
    }

    return fechasPorMes;
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
    return (monthGroup.get('fechas') as FormArray).controls as FormControl[];
  }

  getMonthGroup(index: number): FormGroup {
    return this.monthsArray.at(index) as FormGroup;
  }

  // Eventos del Usuario
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let raw = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Permitir borrar libremente
    if (raw.length <= 3) {
      this.form.get('plate')?.setValue(raw, { emitEvent: false });
      input.value = raw;
      return;
    }

    // Aplicar formato solo si hay al menos 3 letras y algo de números
    const match = raw.match(/^([A-Z]{3})(\d{0,3})$/);
    if (match) {
      raw = `${match[1]}-${match[2]}`;
    }

    this.form.get('plate')?.setValue(raw, { emitEvent: false });
    input.value = raw;
  }


  onMesSeleccionado(index: number): void {
    const monthGroup = this.monthsArray.at(index);
    const completed = monthGroup.get('completed')?.value;
    const fechas = monthGroup.get('fechas') as FormArray;
    fechas.controls.forEach((control, subIndex) => {
      if (!this.months[index].fechas[subIndex].disabled) {
        control.setValue(completed);
      }
    });
  }


  // updateSubtask(monthIndex: number, subtaskIndex: number, value: boolean) {
  //   const fechasArray = this.monthsArray
  //   .at(monthIndex)
  //   .get('fechas') as FormArray;
  //   fechasArray.at(subtaskIndex).setValue(value);
  // }

  // Envío del Formulario
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Formulario válido:', this.form.value);
  }
  // obtenerDatos(): void {
  //   const payload = {};
  //   this.formularioService.obtenerFormularioCompleto(payload).subscribe({
  //     next: data => console.log('Respuesta API:', data),
  //     error: error => console.error('Error:', error),
  //   });
  // }
}
