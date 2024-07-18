import { HttpStatus } from '@nestjs/common';

export interface ResponseStatus {
  status?: HttpStatus;
  message: string;
  data?: any;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  TRANSACTION_PARTY = 'transaction_party',
}
