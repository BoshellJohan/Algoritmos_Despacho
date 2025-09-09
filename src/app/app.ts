import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Main } from '../components/main/main';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Main],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
