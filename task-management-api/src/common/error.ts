import { BadRequestException, ConflictException } from "@nestjs/common";
import { throwError } from "rxjs";

export const ErrorFunction = (err: any) => {
  if (err.response) {
    return { success: false, code: err.status, result: err.response?.data?.error || err.response?.message };
  }
  else if (err.code == 11000) {
    return throwError(() => new ConflictException({ code: 409, duplicatedData: JSON.parse(JSON.stringify(err.keyValue)), message: `Duplicated ` }));
  } else {
    const code = err?.code || err?.statusCode || err?.status || 400;
    return throwError(() => new BadRequestException({
      message: err?.response?.message || err?.message,
      code: code,
    }));
  }
}