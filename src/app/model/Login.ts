export interface LoginResponseDto {
  token: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}