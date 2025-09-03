import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export type Row = Record<string, any>;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

    // Funzione per capitalizzare una stringa
    capitalizeFirstLetter(str: string): string {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
    // Altre funzioni generiche
    calculateSum(a: number, b: number): number {
      return a + b;
    }

    getEntries(obj: { [key: string]: string }): [string, string][] {
      return Object.entries(obj);
    }

    generateToken(length: number = 32): string {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let token = '';
      for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return token;
    }

    getDateFormatted(date:Date): string {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }

   GetMonth(): any[] {
    let m =  
    [
      { id: 1, name: "January" },
      { id: 2, name: "February" },
      { id: 3, name: "March" },
      { id: 4, name: "April" },
      { id: 5, name: "May" },
      { id: 6, name: "June" },
      { id: 7, name: "July" },
      { id: 8, name: "August" },
      { id: 9, name: "September" },
      { id: 10, name: "October" },
      { id: 11, name: "November" },
      { id: 12, name: "December" }
    ]

    return m;
};

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }

  exportRowsToXlsx(
    rows: any[],
    fileName: string,
    fields: string[],
    labels?: Record<string, string>
  ) {
    if (!rows || rows.length === 0 || !fields || fields.length === 0) return;

    const shaped = rows.map(r => {
      const obj: any = {};
      fields.forEach(f => {
        obj[labels?.[f] ?? f] = this.getNestedValue(r, f);
      });
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(shaped);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
