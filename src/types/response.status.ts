import { HttpStatus } from '@nestjs/common';

export interface ResponseStatus {
  status?: HttpStatus;
  message: string;
  data?: any;
}
