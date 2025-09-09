import { Injectable } from '@angular/core';
import { AnyTxtRecord } from 'dns';
import { last } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Algorithms {
  maxCapacity:number = 20;

  //   processes = [
  //   { id: 0, name: 'P1', intervals: [[1, 2], [4, 5]] },
  //   { id: 1, name: 'P2', intervals: [[0, 1]] },
  //   { id: 2, name: 'P3', intervals: [[1, 2], [4, 5]] }
  // ];

   transformData(data:any[]){
    //Process data here
    let cells:any[] = []
    data.forEach(ele => {
      let min = ele[0]
      let max = ele[ele.length - 1]
      // console.log(min, max)
      for(let i = min; i <= max; i++){
        cells.push(i)
      }
    })

    let processedRow = []
    for(let i = 0; i < this.maxCapacity; i++){
      if(cells.includes(i)){
        processedRow.push(1)
      } else {
        processedRow.push(0)
      }
    }
    return processedRow
  }

  algorithmCompleted(processes:any):boolean {
    return processes.every((p:any) => p['procesado'])
  }

  FIFO(processes:any, maxCapacity:number){
    this.maxCapacity = maxCapacity;
    let currentTime = 0
    let processesFIFO:{id: number, name:string, time:number; rafaga:number; data:any}[] = []
    let algorithCompleted:boolean = false;

    let copy_data = processes.map((p: any) => {
      p.procesado = false
      return p
    });

    let data = JSON.parse(JSON.stringify(copy_data));

    let i = 0;
    let time:number = 0;
    let rafaga:number = 0;
    let atLeastOneProcessed:boolean = false

    while(!algorithCompleted){
      time = data[i]["time"]
      rafaga = data[i]['rafaga'];

      if(time <= currentTime && !data[i].procesado){
        data[i]['procesado'] = true;
        atLeastOneProcessed = true;
        let intervalo = [currentTime, currentTime + rafaga - 1];
        currentTime += rafaga

        processesFIFO.push({
          "id": data[i].id,
          "name": data[i].name,
          "time": time,
          "rafaga": rafaga,
          "data": this.transformData([intervalo])
        })

        i = 0;
        continue;
      }

      i++

      if(i >= data.length){
        if (!atLeastOneProcessed) {
        currentTime++;
      }
        i = 0
        atLeastOneProcessed = false;
      }

      algorithCompleted = this.algorithmCompleted(data);
    }

    return processesFIFO;
  }

  includesProcess(processes:any, id:number){
    return processes.find((p:any) => p['id'] == id)
  }

  addNewInterval(processes:any, id:number, interval:any){
    processes.forEach((p:any) => {
      if(p['id'] == id){
        p['data'] = [...p['data'], interval];
      }
    })
  }

  RoundRobin(processes:any, maxCapacity:number){
    this.maxCapacity = maxCapacity;
    let q = processes[0]['quantum'];
    let currentTime = 0
    let processesRoundRobin:{id: number, name:string, time:number; rafaga:number; data:any}[] = []
    let algorithCompleted:boolean = false;
    let i = 0;
    let time:number = 0;
    let rafaga:number = 0;
    let atLeastOneProcessed:boolean = false

    let copy_data = processes.map((p: any) => {
      p.procesado = false
      return p
    });

    let data = JSON.parse(JSON.stringify(copy_data));

    while(!algorithCompleted){
      time = data[i]["time"]
      rafaga = data[i]['rafaga'];

      if(time <= currentTime && !data[i].procesado){
        let intervalo:any[] = []
        if(rafaga >= q){
          intervalo = [currentTime, currentTime + q - 1]
          currentTime += q
          data[i]['rafaga'] = rafaga - q;
        } else if (rafaga > 0){
          let distance = q - rafaga;
          intervalo = [currentTime, currentTime + distance - 1]
          currentTime += distance
          data[i]['rafaga'] = rafaga - distance;
        }

        if(data[i]['rafaga'] <= 0){
          data[i]['procesado'] = true; //Llegó a su fin el proceso
        }

        atLeastOneProcessed = true;

        if(this.includesProcess(processesRoundRobin, data[i]['id'])){
          this.addNewInterval(processesRoundRobin, data[i]['id'], intervalo);
        } else {
          processesRoundRobin.push({
            "id": processes[i].id,
            "name": processes[i].name,
            "time": time,
            "rafaga": processes[i]['rafaga'],
            "data": [intervalo]
          })
        }
      }

      i++

      if(i >= data.length){
        if (!atLeastOneProcessed) {
        currentTime++;
      }
        i = 0
        atLeastOneProcessed = false;
      }

      algorithCompleted = this.algorithmCompleted(data);
    }

    //Al final sí se transforman los intervalos a 0's y 1's
    processesRoundRobin.forEach((p:any) => {
      p['data'] = this.transformData(p['data']);
    })
    return processesRoundRobin;
  }

  SJF(processes:any, maxCapacity:number){
    this.maxCapacity = maxCapacity;
    let currentTime = 0
    let processesSJF:{id: number, name:string, time:number; rafaga:number; data:any}[] = []
    let algorithCompleted:boolean = false;

    let copy_data = processes.map((p: any) => {
      p.procesado = false
      return p
    })

    let copy_sort = copy_data.sort((a:any, b:any) => a['rafaga'] - b['rafaga'])
    let data = JSON.parse(JSON.stringify(copy_sort));

    let i = 0;
    let time:number = 0;
    let rafaga:number = 0;
    let atLeastOneProcessed:boolean = false

    while(!algorithCompleted){
      time = data[i]["time"]
      rafaga = data[i]['rafaga'];

      if(time <= currentTime && !data[i].procesado){
        data[i]['procesado'] = true;
        atLeastOneProcessed = true;
        let intervalo = [currentTime, currentTime + rafaga - 1];
        currentTime += rafaga

        processesSJF.push({
          "id": data[i].id,
          "name": data[i].name,
          "time": time,
          "rafaga": rafaga,
          "data": this.transformData([intervalo])
        })

        i = 0;
        continue;
      }

      i++

      if(i >= data.length){
        if (!atLeastOneProcessed) {
        currentTime++;
      }
        i = 0
        atLeastOneProcessed = false;
      }

      algorithCompleted = this.algorithmCompleted(data);
    }

    return processesSJF;
  }


  Priority(processes:any, maxCapacity:number){
    this.maxCapacity = maxCapacity;
    let currentTime = 0
    let processesPriority:{id: number, name:string, time:number; rafaga:number; data:any}[] = []
    let algorithCompleted:boolean = false;

    let copy_data = processes.map((p: any) => {
      p.procesado = false
      return p
    })

    let copy_sort = copy_data.sort((a:any, b:any) => a['priority'] - b['priority'])
    let data = JSON.parse(JSON.stringify(copy_sort));

    let i = 0;
    let time:number = 0;
    let rafaga:number = 0;
    let atLeastOneProcessed:boolean = false

    while(!algorithCompleted){
      time = data[i]["time"]
      rafaga = data[i]['rafaga'];

      if(time <= currentTime && !data[i].procesado){
        data[i]['procesado'] = true;
        atLeastOneProcessed = true;
        let intervalo = [currentTime, currentTime + rafaga - 1];
        currentTime += rafaga

        processesPriority.push({
          "id": data[i].id,
          "name": data[i].name,
          "time": time,
          "rafaga": rafaga,
          "data": this.transformData([intervalo])
        })

        i = 0;
        continue;
      }

      i++

      if(i >= data.length){
        if (!atLeastOneProcessed) {
        currentTime++;
      }
        i = 0
        atLeastOneProcessed = false;
      }

      algorithCompleted = this.algorithmCompleted(data);
    }

    return processesPriority;
  }

  SRTF(processes: any, maxCapacity:number){
    this.maxCapacity = maxCapacity;
    let currentTime = 0;
    let processesSRTF: { id: number, name: string, data: any }[] = [];
    let algorithCompleted = false;

    // Copia profunda de los procesos con rafaga restante
    let data = processes.map((p: any) => ({
      ...p,
      rafagaRestante: p.rafaga,
      procesado: false
    }));

    // Control de intervalos
    let lastProcess: any = null;

    while (!algorithCompleted) {
      // Filtrar procesos disponibles (llegaron y no terminaron)
      let available = data.filter((p: any) => p.time <= currentTime && !p.procesado);

      if (available.length > 0) {
        // Elegir proceso con menor rafaga restante
        let shortest = available.reduce((min: any, p: any) =>
          p.rafagaRestante < min.rafagaRestante ? p : min
        );

        // Si cambia el proceso (interrupción)
        if (!lastProcess || lastProcess.id !== shortest.id) {
          if (lastProcess) {
            // Cerrar el intervalo anterior
            this.addInterval(processesSRTF, lastProcess.id, lastProcess.start, currentTime - 1, lastProcess.rafaga, lastProcess.time);
          }
          // Abrir un nuevo intervalo
          shortest.start = currentTime;
        }

        // Ejecutar 1 unidad de tiempo
        shortest.rafagaRestante -= 1;

        // Si termina, cerrar su intervalo
        if (shortest.rafagaRestante === 0) {
          shortest.procesado = true;
          this.addInterval(processesSRTF, shortest.id, shortest.start, currentTime, shortest.rafaga, shortest.time);
        }

        lastProcess = shortest;
      }

      currentTime++;

      algorithCompleted = data.every((p: any) => p.procesado);
    }

    // Transformar datos para Gantt
    processesSRTF.forEach((p: any) => {
      p.data = this.transformData(p.data);
    });

    return processesSRTF;
  }


  addInterval(list: any[], id: number, start: number, end: number, rafaga: number, time: number) {
  let proc = list.find((p: any) => p.id === id);
  if (proc) {
    proc.data.push([start, end]);
  } else {
    list.push({
      id: id,
      name: `P${id}`,
      rafaga: rafaga,
      time: time,
      data: [[start, end]]
    });
  }
}

  hasIntervarls(data:any):boolean{
    let firstOne = false;
    let firstZeroAfterOne = false;

    for(let i = 0; i <= data.length; i++){
      if(data[i] == 1){
        firstOne = true;
      }

      if(firstOne && data[i] == 0){
        firstZeroAfterOne = true;
      }

      if(firstZeroAfterOne && data[i] == 1){
        return true;
      }
    }

    return false
  }

  tiempoSalida(data:any) {
    for(let i = 0; i < data.length; i++){
      if(data[i] == 1){
        return i;
      }
    }

    return 0;
  }

  tiempoEsperaConIntervalos(data: number[], arrivalTime: number): number {
    let tiempoEspera = 0;
    let inBlock = false;
    let lastEnd = arrivalTime;

    for (let i = 0; i < data.length; i++) {
      if (data[i] === 1 && !inBlock) {
        // Inicio de un bloque
        tiempoEspera += i - lastEnd;
        inBlock = true;
      }

      if (data[i] === 0 && inBlock) {
        // Fin de un bloque
        lastEnd = i;
        inBlock = false;
      }
    }

    return tiempoEspera;
  }


  calcTiempoEspera(data:any):number {
    let tiempoEspera = 0;

    let hasIntervalsFlag = false;
    data.forEach((p:any) => {
      if(this.hasIntervarls(p['data'])){
        hasIntervalsFlag = true;
      }
      return p;
    })


    if(!hasIntervalsFlag){
      let summatory = 0;
      let copyData = JSON.parse(JSON.stringify(data));
      copyData.forEach((p:any) => {
        let time = p.time;
        let tiempo_salida = this.tiempoSalida(p['data'])
        summatory += tiempo_salida - time
      })

      tiempoEspera = summatory / copyData.length;
    } else {
      let summatory = 0;
      let copyData = JSON.parse(JSON.stringify(data));
      copyData.forEach((p:any) => {
        let tiempo_espera = this.tiempoEsperaConIntervalos(p['data'], p['time'])
        summatory += tiempo_espera;
      })

      tiempoEspera = summatory / copyData.length;
    }


    return tiempoEspera;
  }

  getEndedTime(data:any){
    let lastOne = 0;
    for(let i = 0; i <= data.length; i++){
      if(data[i] == 1){
        lastOne = i
      }
    }
    return lastOne + 1;
  }

  calcTiempoSistema(data:any){
    let tiempoSistema = 0;

    let summatory = 0;
    let copyData = JSON.parse(JSON.stringify(data));
    copyData.forEach((p:any) => {
      let time = p.time;
      let tiempo_finalizador = this.getEndedTime(p['data'])
      // console.log(`${tiempo_finalizador} - ${time}`);
      summatory += tiempo_finalizador - time
      // console.log(summatory, tiempo_finalizador)
    })

    tiempoSistema = summatory / copyData.length;

    return tiempoSistema;
  }

}
