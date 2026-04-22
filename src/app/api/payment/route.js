import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Dummy payment route is live",
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request) {
  let payload = {};

  try {
    payload = await request.json();
  } catch {
    payload = {};
  }

  const transactionId = `DUMMY-${Date.now()}`;

  return NextResponse.json({
    ok: true,
    status: "success",
    gateway: "PayU",
    transactionId,
    amount: payload.amount ?? 5150,
    currency: payload.currency ?? "INR",
    message: "Dummy payment processed successfully",
  });
}
