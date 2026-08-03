import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';

import { LanguageService } from '../../services/language.service';
import {
  ProductImportService,
  ImportBatchStatus,
  ImportRowErrorItem
} from '../../services/product-import.service';

@Component({
  selector: 'app-admin-product-import',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-product-import.html',
  styleUrls: ['./admin-product-import.css']
})
export class AdminProductImport implements OnDestroy {

  // ==========================
  // FILE SELECTION
  // ==========================
  selectedFile: File | null = null;
  dragOver = false;
  pickError = '';

  // ==========================
  // UPLOAD / PROGRESS
  // ==========================
  uploading = false;
  uploadPercent = 0;

  currentBatch: ImportBatchStatus | null = null;
  private pollSub: Subscription | null = null;

  // ==========================
  // ERROR REPORT
  // ==========================
  errors: ImportRowErrorItem[] = [];
  errorsPage = 0;
  errorsTotalPages = 0;
  loadingErrors = false;

  // ==========================
  // HISTORY
  // ==========================
  history: ImportBatchStatus[] = [];
  historyPage = 0;
  historyTotalPages = 0;
  loadingHistory = false;

  // ==========================
  // 🗑️ TRASH (deleted history rows)
  // ==========================
  activeTab: 'history' | 'trash' = 'history';
  trash: ImportBatchStatus[] = [];
  trashPage = 0;
  trashTotalPages = 0;
  loadingTrash = false;
  trashLoadedOnce = false;
  actionError = '';

  constructor(
    private importService: ProductImportService,
    public languageService: LanguageService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadHistory(0);
  }

  t(key: string): string {
    return this.languageService.translate(key);
  }

  bn(): boolean {
    return this.languageService.isBangla();
  }

  ngOnDestroy() {
    this.stopPolling();
  }

  // ==========================
  // FILE PICK / DRAG & DROP
  // ==========================

  onFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.setFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;

    if (event.dataTransfer?.files?.length) {
      this.setFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  private setFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext !== 'xlsx' && ext !== 'csv') {
      this.pickError = this.bn()
        ? 'শুধু .xlsx অথবা .csv ফাইল আপলোড করা যাবে।'
        : 'Only .xlsx or .csv files are supported.';
      this.selectedFile = null;
      return;
    }

    this.pickError = '';
    this.selectedFile = file;
  }

  clearFile() {
    this.selectedFile = null;
    this.pickError = '';
  }

  // ==========================
  // UPLOAD
  // ==========================

  startUpload() {

    if (!this.selectedFile || this.uploading) return;

    this.uploading = true;
    this.uploadPercent = 0;
    this.currentBatch = null;

    this.importService.uploadFile(this.selectedFile).subscribe({
      next: (event) => {

        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadPercent = Math.round((event.loaded / event.total) * 100);
          this.cdr.detectChanges();
        }

        if (event.type === HttpEventType.Response) {
          const body = event.body;

          if (body?.success && body.data) {
            this.currentBatch = body.data;
            this.selectedFile = null;
            this.startPolling(body.data.id);
          } else {
            this.pickError = body?.message || (this.bn() ? 'আপলোড ব্যর্থ হয়েছে' : 'Upload failed');
            this.uploading = false;
          }
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.uploading = false;
        this.pickError = err?.error?.message
          || (this.bn() ? 'আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Upload failed. Please try again.');
        this.cdr.detectChanges();
      }
    });
  }

  // ==========================
  // LIVE STATUS POLLING
  // ==========================

  private startPolling(batchId: number) {

    this.stopPolling();

    this.pollSub = interval(2000)
      .pipe(
        switchMap(() => this.importService.getStatus(batchId)),
        takeWhile(res => {
          const status = res.data?.status;
          return status === 'PROCESSING';
        }, true) // emit the final (non-processing) value too
      )
      .subscribe({
        next: (res) => {
          this.currentBatch = res.data;
          this.cdr.detectChanges();

          if (res.data.status !== 'PROCESSING') {
            this.uploading = false;
            this.loadHistory(0);

            if (res.data.status !== 'COMPLETED') {
              this.loadErrors(0);
            }
          }
        },
        error: () => {
          this.uploading = false;
        }
      });
  }

  private stopPolling() {
    if (this.pollSub) {
      this.pollSub.unsubscribe();
      this.pollSub = null;
    }
  }

  // ==========================
  // ERROR REPORT
  // ==========================

  loadErrors(page: number) {
    if (!this.currentBatch) return;

    this.loadingErrors = true;

    this.importService.getErrors(this.currentBatch.id, page, 50).subscribe({
      next: (res) => {
        this.errors = res.data.content;
        this.errorsPage = res.data.number;
        this.errorsTotalPages = res.data.totalPages;
        this.loadingErrors = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingErrors = false;
      }
    });
  }

  downloadErrorReport() {
    if (!this.currentBatch) return;

    this.importService.downloadErrorReport(this.currentBatch.id).subscribe(blob => {
      this.saveBlob(blob, `import-${this.currentBatch!.id}-errors.csv`);
    });
  }

  // ==========================
  // HISTORY
  // ==========================

  loadHistory(page: number) {
    this.loadingHistory = true;

    this.importService.getHistory(page, 10).subscribe({
      next: (res) => {
        this.history = res.data.content;
        this.historyPage = res.data.number;
        this.historyTotalPages = res.data.totalPages;
        this.loadingHistory = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingHistory = false;
      }
    });
  }

  // ==========================
  // 🗑️ DELETE / RECOVERY (trash bin)
  // ==========================

  switchTab(tab: 'history' | 'trash') {
    this.activeTab = tab;
    this.actionError = '';

    if (tab === 'trash' && !this.trashLoadedOnce) {
      this.loadTrash(0);
    }
  }

  loadTrash(page: number) {
    this.loadingTrash = true;

    this.importService.getTrash(page, 10).subscribe({
      next: (res) => {
        this.trash = res.data.content;
        this.trashPage = res.data.number;
        this.trashTotalPages = res.data.totalPages;
        this.loadingTrash = false;
        this.trashLoadedOnce = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingTrash = false;
      }
    });
  }

  // Move a history row to Trash
  deleteBatch(batch: ImportBatchStatus, event: Event) {
    event.stopPropagation();
    this.actionError = '';

    const msg = this.bn()
      ? `"${batch.fileName}" ইমপোর্ট হিস্টোরি ট্র্যাশে সরাতে চান?`
      : `Move "${batch.fileName}" to Trash?`;

    if (!confirm(msg)) return;

    this.importService.deleteBatch(batch.id).subscribe({
      next: () => {
        this.history = this.history.filter(h => h.id !== batch.id);
        this.trashLoadedOnce = false; // force a fresh trash list next time it's opened
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.actionError = err?.error?.message
          || (this.bn() ? 'ডিলিট করা যায়নি।' : 'Could not delete this item.');
        this.cdr.detectChanges();
      }
    });
  }

  // Bring a Trash row back into the main history list
  restoreBatch(batch: ImportBatchStatus, event: Event) {
    event.stopPropagation();
    this.actionError = '';

    this.importService.restoreBatch(batch.id).subscribe({
      next: () => {
        this.trash = this.trash.filter(t => t.id !== batch.id);
        this.loadHistory(0);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.actionError = err?.error?.message
          || (this.bn() ? 'পুনরুদ্ধার করা যায়নি।' : 'Could not restore this item.');
        this.cdr.detectChanges();
      }
    });
  }

  // Permanently remove a Trash row (cannot be undone)
  permanentlyDeleteBatch(batch: ImportBatchStatus, event: Event) {
    event.stopPropagation();
    this.actionError = '';

    const msg = this.bn()
      ? `"${batch.fileName}" স্থায়ীভাবে ডিলিট হয়ে যাবে — এটি আর ফিরিয়ে আনা যাবে না। নিশ্চিত?`
      : `Permanently delete "${batch.fileName}"? This cannot be undone.`;

    if (!confirm(msg)) return;

    this.importService.permanentlyDeleteBatch(batch.id).subscribe({
      next: () => {
        this.trash = this.trash.filter(t => t.id !== batch.id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.actionError = err?.error?.message
          || (this.bn() ? 'স্থায়ীভাবে ডিলিট করা যায়নি।' : 'Could not permanently delete this item.');
        this.cdr.detectChanges();
      }
    });
  }

  viewBatch(batch: ImportBatchStatus) {
    this.currentBatch = batch;
    this.errors = [];

    if (batch.status === 'PROCESSING') {
      this.uploading = true;
      this.startPolling(batch.id);
    } else if (batch.status !== 'COMPLETED') {
      this.loadErrors(0);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================
  // TEMPLATE DOWNLOAD
  // ==========================

  downloadTemplate() {
    this.importService.downloadTemplate().subscribe(blob => {
      this.saveBlob(blob, 'product-bulk-import-template.xlsx');
    });
  }

  // ==========================
  // HELPERS
  // ==========================

  private saveBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  statusLabel(status: string): string {
    const map: Record<string, { en: string; bn: string }> = {
      PROCESSING: { en: 'Processing…', bn: 'প্রসেসিং চলছে…' },
      COMPLETED: { en: 'Completed', bn: 'সম্পন্ন' },
      COMPLETED_WITH_ERRORS: { en: 'Completed (with issues)', bn: 'সম্পন্ন (কিছু সমস্যা সহ)' },
      FAILED: { en: 'Failed', bn: 'ব্যর্থ' }
    };
    const entry = map[status] || { en: status, bn: status };
    return this.bn() ? entry.bn : entry.en;
  }

  progressPercent(batch: ImportBatchStatus | null): number {
    if (!batch || !batch.totalRows) return 0;
    return Math.min(100, Math.round((batch.processedRows / batch.totalRows) * 100));
  }
}
