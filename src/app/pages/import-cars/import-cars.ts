import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-import-cars',
  imports: [RouterLink],
  templateUrl: './import-cars.html',
  styleUrl: '../service-page.scss',
})
export class ImportCars {}
