export interface LoadDocumentResponse {
  documentId: string;
  documentName: string;
}

export interface PaginatedDocumentResponse {
  documents: LoadDocumentResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}


export interface DocumentFilters {
  fileName?: string;
  createdAt?: string;
  targetDate?: string;
  page: number;
  size: number;
}