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
}
