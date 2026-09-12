import { NextResponse } from "next/server";

export function errorResponse(
  message: string,
  status: number,
  details?: string
) {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  );
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}