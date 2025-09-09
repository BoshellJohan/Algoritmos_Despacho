import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Algorithms } from '../../services/algorithms';

@Component({
  selector: 'app-gantt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gantt.html',
  styleUrl: './gantt.css'
})

export class GanttChart{
  constructor(public algorithms:Algorithms){}

  private _processes: { id: number; name: string; time:number; rafaga:number; data: number[] }[] = [];

  @Input() set processes(value: { id: number; name: string; time:number; rafaga:number; data: number[] }[]) {
    this._processes = value;
    console.log('Procesos recibidos en GanttChart:', value);
    this.calcTimes()
  }

  get processes() {
    // console.log(this._processes)
    return this._processes;
  }

  @Input() titleChart:string = "";
  @Input() maxCapacity:number = 0;
  tiempoEspera:number = 0;
  tiempoSistema:number = 0;

  calcTimes(){
    // console.log(this._processes);1
    this.tiempoEspera = this.algorithms.calcTiempoEspera(this._processes)
    this.tiempoSistema = this.algorithms.calcTiempoSistema(this._processes)
  }


  get timer(): number[] {
    return Array.from({ length: this.maxCapacity }, (_, i) => i);
  }
}
