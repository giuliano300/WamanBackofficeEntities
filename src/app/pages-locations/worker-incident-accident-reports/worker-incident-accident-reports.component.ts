import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FeathericonsModule } from '../../icons/feathericons/feathericons.module';
import { CommonModule, NgFor } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CustomDateFormatPipe } from '../../custom-date-format.pipe';
import { Router, RouterLink } from '@angular/router';
import { TemplatePdfService } from '../../services/template-pdf.service';
import { UtilsService } from '../../utils.service';
import { CompleteLocation } from '../../interfaces/CompleteLocation';
import { API_URL_DOC } from '../../../main';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkerIncidentAccidentReportsService } from '../../services/worker-incident-accident-reports.service';
import { CompleteWorkerIncidentAccidentReports } from '../../interfaces/CompleteWorkerIncidentAccidentReports';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-worker-incident-accident-reports',
  imports: [MatCardModule, MatButtonModule, MatSlideToggleModule, ReactiveFormsModule, MatSelect, MatFormField, MatLabel, FeathericonsModule, NgFor, MatOption,
    MatMenuModule, MatPaginatorModule, MatTableModule, MatCheckboxModule, CommonModule, RouterLink, CustomDateFormatPipe, MatProgressSpinnerModule],
  templateUrl: './worker-incident-accident-reports.component.html',
  styleUrl: './worker-incident-accident-reports.component.scss'
})
export class WorkerIncidentAccidentReportsComponent {
  year: number | null = null;
  month: number | null = null;
  locationId: number | null = null;
  completeLocation: CompleteLocation | undefined = undefined;
  completeWorkerIncidentAccidentReports : CompleteWorkerIncidentAccidentReports[] | undefined = undefined;
  months: any[] = [];
  years: any[] = [];
  dataSource = new MatTableDataSource<CompleteWorkerIncidentAccidentReports>(this.completeWorkerIncidentAccidentReports);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['complier', 'name', 'lastName', 'place', 'date', 'hour', 'uploadFiles','action'];

  form: FormGroup;

  isLoading: boolean = true;

  isDisabled: boolean = true;

  constructor(
      private router: Router,
      private workerIncidentAccidentReportsService: WorkerIncidentAccidentReportsService,
      private templatePdfService: TemplatePdfService,
      private utilService: UtilsService,
      private fb: FormBuilder,
      private dialog: MatDialog
  ) 
  {
    this.form = this.fb.group({
      month: [null],
      year: [null]
    });
  }

  ngOnInit(): void {

    this.isLoading = true;

    const token = localStorage.getItem('authToken');
    if (!token) 
      this.router.navigate(['/']);

    const stored = localStorage.getItem('completeLocation');
      if(!stored)
        this.router.navigate(['/']);

    this.completeLocation = JSON.parse(stored!);

    this.locationId = this.completeLocation?.location.id!;

    this.year = new Date().getFullYear();
    this.month = new Date().getMonth() + 1;

    this.years = [this.year - 1, this.year , this.year + 1];

    this.form.patchValue({ month: this.month, year: this.year });

    this.months = this.utilService.GetMonth();

    this.getWorkerIncidentAccidentReports(this.month, this.year);
  }

  onSubmit() {
    if (this.form.valid) {
        const month = this.form.value.month;
        const year = this.form.value.year;
        this.getWorkerIncidentAccidentReports(month, year);
    }
  }

  getWorkerIncidentAccidentReports(month:number, year: number){
    this.workerIncidentAccidentReportsService.getWorkerIncidentAccidentReports(month, year, 0, this.locationId!)
      .subscribe((data: CompleteWorkerIncidentAccidentReports[]) => {
        if (!data || data.length === 0) {
          console.log('Nessun dato disponibile');
          this.dataSource.data = [];
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
          this.isDisabled = true;
        } 
        else 
        {
          this.completeWorkerIncidentAccidentReports = data.map(c => ({
              ...c,
              workerIncidentAccidentReport: {
                ...c.workerIncidentAccidentReport,
                uploadFiles: typeof c.workerIncidentAccidentReport.uploadFiles === 'string'
                  ? JSON.parse(c.workerIncidentAccidentReport.uploadFiles)
                  : c.workerIncidentAccidentReport.uploadFiles
              },
              action: {
                  edit: 'ri-edit-line',
                  delete: 'ri-delete-bin-line'
              }
          }));;
          this.dataSource = new MatTableDataSource<CompleteWorkerIncidentAccidentReports>(this.completeWorkerIncidentAccidentReports);
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
          this.isDisabled = false;
        }
    });
  }
  
  downloadFile(file: { name: string, base64: string }) {
    const byteCharacters = atob(file.base64);
    const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  }


  async generateIncidentAccidentPdf(): Promise<void> {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const month = this.months.find(m => m.id === this.form.get('month')?.value)?.name || '';
    const year = this.form.get('year')?.value || '';
    const hasData = this.dataSource.filteredData.length > 0;

    // ✅ Logo centrato
    const logoData = await this.loadLogoAsBase64('images/logo-icon.png');
    const logoWidth = 20;
    const logoHeight = 22;
    const logoX = (pageWidth - logoWidth) / 2;

    doc.addImage(logoData, 'PNG', logoX, 10, logoWidth, logoHeight);

    // ✅ Titolo
    doc.setFontSize(12);
    doc.text('INCIDENT / ACCIDENT REPORT', pageWidth / 2, 41, { align: 'center' });

    // ✅ Periodo
    doc.setFontSize(10);
    doc.text(`Month: ${month}    Year: ${year}`, 14, 45);

    if (hasData) {
      autoTable(doc, {
        startY: 48,
        head: [[
          'NAME',
          'SURNAME',
          'I.D. CARD No.',
          'ENTITY',
          'LOCATION',
          'DATE OF INCINDENT/ACCIDENT',
          'PLACE OF INCINDENT/ACCIDENT'
        ]],
        body: this.dataSource.filteredData.map((el: any) => [
          el.worker.name,
          el.worker.lastName,
          el.worker.idCardNumber || '-',
          el.entity.name || '-',
          el.location.name || '-',
          this.formatDate(el.workerIncidentAccidentReport.date),
          el.workerIncidentAccidentReport.place || '-'
        ]),
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineWidth: 0.1,
          lineColor: [200, 200, 200],
          textColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center',
          lineWidth: 0.2,
          lineColor: [200, 200, 200]
        },
        bodyStyles: {
          valign: 'top'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 30 }, // NAME
          1: { cellWidth: 30 }, // SURNAME
          2: { cellWidth: 32 }, // I.D. CARD No.
          3: { cellWidth: 40 }, // ENTITY
          4: { cellWidth: 30 }, // LOCATION
          5: { cellWidth: 50 }, // DATE
          6: { cellWidth: 65 }  // PLACE
        },
        didDrawPage: () => {
          doc.setFontSize(9);
          doc.text('Compiled by HR Department', 14, pageHeight - 15);
          doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - 20, pageHeight - 15);
        }
      });
    } else {
      doc.setFontSize(12);
      doc.text(`No Disciplinary Reports for ${month} ${year}`, 14, 65);
    }

    doc.save(`disciplinary-report-${month}-${year}.pdf`);
  }

  private loadLogoAsBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (err) => reject(err);
    });
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT'); 
  }


  UpdateItem(item:CompleteWorkerIncidentAccidentReports){
     this.router.navigate(["/worker-incident-accident-reports/add/" + item.workerIncidentAccidentReport.id]);
  }


  DeleteItem(item:CompleteWorkerIncidentAccidentReports){

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.workerIncidentAccidentReportsService.deleteWorkerIncidentAccidentReport(item.workerIncidentAccidentReport)
          .subscribe((data: boolean) => {
            if(data){
              const month = this.form.value.month;
              const year = this.form.value.year;
              this.getWorkerIncidentAccidentReports(month, year);
            }
          });
      } 
      else 
      {
        console.log("Close");
      }
    });
  }

}
