
import { Component, OnInit } from '@angular/core';
import { GanttChart } from '../gantt/gantt';
import { FormsModule } from '@angular/forms';

import { Process } from '../../services/process';
import { Algorithms } from '../../services/algorithms';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [GanttChart, FormsModule],
  templateUrl: './main.html',
  styleUrls: ['./form.css', './process.css', './charts.css']
})
export class Main implements OnInit {
  maxCapacity = 25;
  private nextId:number = 0;
  data_processed:{id: number, name:string, time:number; rafaga:number; data:any[]}[] = []
  processesFIFO:{id: number, name:string, time:number; rafaga:number; data:any[]}[] = []
  processesSJF:{id: number, name:string, time:number; rafaga:number; data:any[]}[] = []
  processesPriority:{id: number, name:string, time:number; rafaga:number; data:any[]}[] = []
  processesSRTF:{id: number, name:string, time:number; rafaga:number; data:any[]}[] = []
  processesRoundRobin:{id: number, name:string, time:number; rafaga:number; data:any[]}[] = []

  showPriority:boolean = false;
  showRoundRobin:boolean = false;
  showEditButton:boolean = true;
  showDeleteButton:boolean = true;
  showSaveButton:boolean = false;
  showCancelButton:boolean = false;

  //Charts
  showChartFIFO:boolean = false;
  showChartSJF:boolean = false;
  showChartRoundRobin:boolean = false;
  showChartPriority:boolean = false;
  showChartSRTF:boolean = false;
  showAll:boolean = true;

  newProcess = {
    "id": this.nextId,
    "name": "",
    "rafaga": 0,
    "time": 0,
    "priority": 0,
    "quantum": 0,
    "edit": false,
  }

  processesActives: { id: number; name: string; rafaga: number; time: number; priority?: number; quantum?: number; procesado?:boolean; edit:boolean}[] = [];


  title:string = "Round Robin"

  constructor(public processService:Process, public algorithmService:Algorithms){};


  toggleEditMode(){
    this.showEditButton = !this.showEditButton;
    this.showSaveButton = !this.showSaveButton;
    this.showDeleteButton = !this.showDeleteButton;
    this.showCancelButton = !this.showCancelButton;
  }

  editProcess(process_name:string){
    this.toggleEditMode()

    this.processService.getProcessByName(process_name, this.processesActives)
    .then(res_process => {
      if (res_process) {
        // console.log('Proceso encontrado:', res_process);
        res_process['edit'] = true;
      } else {
        // console.log('No se encontró el proceso');
      }
    });
  }

  updateProcess(process_name:string){
    this.toggleEditMode()
    this.processService.getProcessByName(process_name, this.processesActives)
    .then(res_process => {
      if (res_process) {
        // console.log('Proceso actualizado:', res_process);
        res_process['edit'] = false;
      } else {
        console.log('No se encontró el proceso');
      }
    });

    if(this.showAll){
      this.showAllCharts()
    } else {
      this.updateCharts()
    }

  }

  addProcess() {
    // Genera un ID único
    this.nextId = this.processesActives.length + 1
    const processToAdd = {
      ...this.newProcess,
      id: this.nextId++
    };

    this.processesActives.push(processToAdd);

    // Resetea el formulario
    this.newProcess = {
      id: this.nextId,
      name: "",
      rafaga: 0,
      time: 0,
      priority: 0,
      quantum: 0,
      edit: false
    };

    if(this.showAll){
      this.showAllCharts()
    } else {
      this.updateCharts()
    }

  }

  deleteProcess(process_name:string){

  }

  cancelProcess(process_name:string){

  }


  togglePriority(){
    this.showPriority = !this.showPriority;
  }

  toggleRoundRobin(){
    this.togglePriority()
    this.showRoundRobin = !this.showRoundRobin;
  }

  updateCharts(){
    this.calcFIFO();
    this.calcSJF();
    this.calcPriority();
    this.calcRoundRobin();
    this.calcSRTF();
  }

  calcFIFO(){
    let data_test:any = []
    if(this.showChartFIFO){
      data_test = this.algorithmService.FIFO(this.processesActives)
    }
    this.processesFIFO = data_test
  }

  calcRoundRobin(){
    let data_test:any = []
    if(this.showChartRoundRobin){
      data_test = this.algorithmService.RoundRobin(this.processesActives)
    }

    this.processesRoundRobin = data_test
  }

  calcSJF(){
    let data_test:any = []
    if(this.showChartSJF){
      data_test = this.algorithmService.SJF(this.processesActives)
    }

    this.processesSJF = data_test
  }

  calcPriority(){
    let data_test:any = []
    if(this.showChartPriority){
      data_test = this.algorithmService.Priority(this.processesActives)
    }

    this.processesPriority = data_test
  }

  calcSRTF(){
    let data_test:any = []
    if(this.showChartSRTF){
      data_test = this.algorithmService.SRTF(this.processesActives)
    }

    this.processesSRTF = data_test
  }

  toggleFIFOChart(){
    this.showChartFIFO = !this.showChartFIFO;
    if(this.showChartFIFO){
      this.calcFIFO()
    }
  }

  toggleChartSJF(){
    this.showChartSJF = !this.showChartSJF;
    if(this.showChartSJF){
      this.calcSJF()
    }
  }

  toggleChartPriority(){
    this.showChartPriority = !this.showChartPriority;
    if(this.showChartPriority){
      this.calcPriority()
    }
  }

  toggleChartSRTF(){
    this.showChartSRTF = !this.showChartSRTF;
    if(this.showChartSRTF){
      this.calcSRTF()
    }
  }

  toggleChartRoundRobin(){
    this.showChartRoundRobin = !this.showChartRoundRobin;
    if(this.showChartRoundRobin){
      this.calcRoundRobin()
    }
  }

  showAllCharts(){
    if(!this.showAll){
      this.showChartFIFO = false;
      this.showChartSJF = false;
      this.showChartPriority = false;
      this.showChartRoundRobin = false;
      this.showChartSRTF = false;
    } else {
      this.showChartFIFO = true;
      this.showChartSJF = true;
      this.showChartPriority = true;
      this.showChartRoundRobin = true;
      this.showChartSRTF = true;
      this.updateCharts()
    }

    this.showAll = !this.showAll
  }


  ngOnInit(): void {
    this.processesActives.push({
      "id": 1,
      "name": 'P1',
      "rafaga": 4,
      "time": 0,
      "priority": 1,
      "quantum": 2,
      "edit": false
    });
    this.processesActives.push({
      "id": 2,
      "name": 'P2',
      "rafaga": 2,
      "time": 1,
      "priority": 1,
      "quantum": 2,
      "edit": false
    });

    this.processesActives.push({
      "id": 3,
      "name": 'P3',
      "rafaga": 6,
      "time": 1,
      "priority": 2,
      "quantum": 2,
      "edit": false
    });

    this.processesActives.push({
      "id": 4,
      "name": 'P4',
      "rafaga": 4,
      "time": 2,
      "priority": 2,
      "quantum": 2,
      "edit": false
    });

    this.processesActives.push({
      "id": 5,
      "name": 'P5',
      "rafaga": 3,
      "time": 2,
      "priority": 1,
      "quantum": 2,
      "edit": false
    });

    this.processesActives.push({
      "id": 6,
      "name": 'P6',
      "rafaga": 2,
      "time": 3,
      "priority": 3,
      "quantum": 2,
      "edit": false
    });

  }

}

