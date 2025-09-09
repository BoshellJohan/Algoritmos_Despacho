
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
  styleUrls: ['./styles/form.css', './styles/process.css', './styles/charts.css']
})
export class Main implements OnInit {
  maxCapacity = 20;
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

  //Message
  message:string = ""
  showMessage:boolean = false;

  newProcess = {
    "id": this.nextId,
    "name": "",
    "rafaga": 0,
    "time": 0,
    "priority": 0,
    "quantum": 1,
    "edit": false,
  }

  processesActives: { id: number; name: string; rafaga: number; time: number; priority?: number; quantum?: number; procesado?:boolean; edit:boolean}[] = [];


  title:string = "Round Robin"

  constructor(public processService:Process, public algorithmService:Algorithms){};

  activeMessage(message:string){
    this.showMessage = true;
    this.message = message;
    setTimeout(() => {
      this.showMessage = false;
    }, 4000)
  }

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

    this.calcMaxCapacity();
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

    if(this.processService.isValidProcess(processToAdd)){
      this.processesActives.push(processToAdd);

      // Resetea el formulario
      this.newProcess = {
        id: this.nextId,
        name: "",
        rafaga: 0,
        time: 0,
        priority: 0,
        quantum: 1,
        edit: false
      };

      this.calcMaxCapacity()
      if(this.showAll){
        this.showAllCharts()
      } else {
        this.updateCharts()
      }
    } else {
      this.activeMessage("Por favor digite valores válidos.");
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
      data_test = this.algorithmService.FIFO(this.processesActives, this.maxCapacity)
    }
    this.processesFIFO = data_test
  }

  calcRoundRobin(){
    let data_test:any = []
    if(this.showChartRoundRobin){
      data_test = this.algorithmService.RoundRobin(this.processesActives, this.maxCapacity)
    }

    this.processesRoundRobin = data_test
  }

  calcSJF(){
    let data_test:any = []
    if(this.showChartSJF){
      data_test = this.algorithmService.SJF(this.processesActives, this.maxCapacity)
    }

    this.processesSJF = data_test
  }

  calcPriority(){
    let data_test:any = []
    if(this.showChartPriority){
      data_test = this.algorithmService.Priority(this.processesActives, this.maxCapacity)
    }

    this.processesPriority = data_test
  }

  calcSRTF(){
    let data_test:any = []
    if(this.showChartSRTF){
      data_test = this.algorithmService.SRTF(this.processesActives, this.maxCapacity)
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

  calcMaxCapacity(){
    let arrayTime = this.processesActives.map((p:any) => p.rafaga)
    let capacity = arrayTime.reduce((acc:any, cur:any) =>  acc + cur, 0)
    if(capacity > this.maxCapacity){
      this.maxCapacity = capacity + 5;
    }
  }


  ngOnInit(): void {
    this.processesActives.push({
      "id": 1,
      "name": 'P1',
      "rafaga": 2,
      "time": 0,
      "priority": 1,
      "quantum": 2,
      "edit": false
    });
    this.processesActives.push({
      "id": 2,
      "name": 'P2',
      "rafaga": 6,
      "time": 1,
      "priority": 1,
      "quantum": 2,
      "edit": false
    });

    this.processesActives.push({
      "id": 3,
      "name": 'P3',
      "rafaga": 4,
      "time": 1,
      "priority": 2,
      "quantum": 2,
      "edit": false
    });
  }

}

