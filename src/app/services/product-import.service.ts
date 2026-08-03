import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ImportBatchStatus {
  id: number;
  fileName: string;
  status: 'PROCESSING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED';
  totalRows: number;
  processedRows: number;
  successCount: number;
  duplicateCount: number;
  failedCount: number;
  failureReason: string | null;
  importedByName: string | null;
  startedAt: string;
  completedAt: string | null;
}

export interface ImportRowErrorItem {
  rowNumber: number;
  productName: string | null;
  skuOrBarcode: string | null;
  errorType: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductImportService {

  private api = 'https://superbangladesh-api-1.onrender.com/api/admin/products/import';

  constructor(private http: HttpClient) {}

  // ==========================
  // UPLOAD (with progress events, since files can be large)
  // ==========================
  uploadFile(file: File): Observable<HttpEvent<ApiResponse<ImportBatchStatus>>> {
    const formData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.api}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request<ApiResponse<ImportBatchStatus>>(req);
  }

  // ==========================
  // POLL STATUS
  // ==========================
  getStatus(batchId: number): Observable<ApiResponse<ImportBatchStatus>> {
    return this.http.get<ApiResponse<ImportBatchStatus>>(`${this.api}/${batchId}/status`);
  }

  // ==========================
  // ERROR REPORT (paginated)
  // ==========================
  getErrors(batchId: number, page: number = 0, size: number = 50): Observable<ApiResponse<PageResult<ImportRowErrorItem>>> {
    return this.http.get<ApiResponse<PageResult<ImportRowErrorItem>>>(
      `${this.api}/${batchId}/errors?page=${page}&size=${size}`
    );
  }

  // ==========================
  // DOWNLOAD ERROR REPORT (CSV)
  // ==========================
  downloadErrorReport(batchId: number): Observable<Blob> {
    return this.http.get(`${this.api}/${batchId}/errors/export`, { responseType: 'blob' });
  }

  // ==========================
  // IMPORT HISTORY
  // ==========================
  getHistory(page: number = 0, size: number = 20): Observable<ApiResponse<PageResult<ImportBatchStatus>>> {
    return this.http.get<ApiResponse<PageResult<ImportBatchStatus>>>(
      `${this.api}/history?page=${page}&size=${size}`
    );
  }

  // ==========================
  // DOWNLOAD SAMPLE TEMPLATE
  // ==========================
  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.api}/template`, { responseType: 'blob' });
  }
}
