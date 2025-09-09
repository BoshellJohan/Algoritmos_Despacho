import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Process {
  getProcessByName(name: string, processes: any[]): Promise<any> {
  return new Promise(resolve => {
    const result = processes.find(p => p.name === name);
    resolve(result);
  });
  }

  deleteProcess(name:string, processes:any[]): Promise<any>{
    return new Promise(resolve => {
      const result = processes.filter((p:any) => p.name.toLowerCase() != name.toLowerCase())
      resolve(result);
    });
  }

  isValidProcess(process:any):boolean{
    let time = process['time'];
    let rafaga = process['rafaga'];
    let prioridad = process['prioridad'];
    let quantum = process['quantum'];
    let name = process['name'];

    if(time < 0 || rafaga < 0 || prioridad < 0 || quantum <= 0 || name === ""){
      return false;
    } else {
      return true;
    }
  }

}
