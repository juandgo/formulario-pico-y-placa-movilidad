import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormsModule, FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list'; // Import this module
import { MatGridTile } from '@angular/material/grid-list'; // Import MatGridTile
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox'; // Import MatCheckboxModule


@Component({
  selector: 'app-formulario',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatGridListModule, // Add MatGridListModule
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss',
})
export class FormularioComponent implements OnInit {
  // form = new FormGroup({});
  form!: FormGroup;
  plate: string = '';
  meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  yearSeleccionado = 2025;

  mesesSeleccionados: { [key: string]: boolean } = {};
  get habilitarCheckBoxes(): boolean {
    return this.plate.trim().length > 0;
  }

  constructor(
    private formBuilder: FormBuilder
  ) { this.buildForm(); }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      // fullName: this.formBuilder.group({
      //   name: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z ]+$/)]],
      //   last: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z ]+$/)]]
      // }),
      name: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z ]+$/)]],
      tipo_doc: ['', [Validators.required]],
      doc_number: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      dv:['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      phone: ['', Validators.required],
      address: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      brand: [''],
      model: [''],
      plate: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-[0-9]{3}$/)]],
      color: ['#000000'],
      date: [''],
      age: [18, [Validators.required, Validators.min(18), Validators.max(100)]],
      category: [''],
      tag: [''],
      agree: [false, [Validators.requiredTrue]],
      gender: [''],
      zone: [''],
      });

    }

    get nameField() {
      return this.form.get('name');
    }

    get mailField() {
      return this.form.get('mail');
    }

    // get emailField() {
    //   return this.form.get('email');
    // }

}

