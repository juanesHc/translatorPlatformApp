export interface PersonData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface EditPersonRequest {
  firstName: string;
  lastName: string;
}

export interface RegisterRequest {
  familyName: string;
  givenName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RetrievePersonRequest {
  givenName?: string;
  familyName?: string;
  email?: string;
  authEnum?: string;
  activate?: boolean | null;
  startDate?: string;
  endDate?: string;
  page: number;
  size: number;
}

export interface RetrievePersonResponse {
  personId: string;
  givenName: string;
  familyName: string;
  email: string;
  role: string;
  authEnum: string;
  activate: boolean;
  createdAt: string;
}

export interface RetrievePersonPageResponse {
  persons: RetrievePersonResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  message: string;
}

export interface AdminRegisterRequest {
  givenName: string;
  familyName: string;
  email: string;
  password: string;
  role: string;
}