export interface DocumentSummary {
  documentId: string;
  documentName: string;
}

export interface DocumentPage {
  documents: DocumentSummary[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}