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