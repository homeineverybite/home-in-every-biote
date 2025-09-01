import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const logPath = path.join(process.cwd(), "data", "invoices.json");
  let data = [];
  if (fs.existsSync(logPath)) {
    data = JSON.parse(fs.readFileSync(logPath, "utf-8"));
  }
  return NextResponse.json({ invoices: data });
}
