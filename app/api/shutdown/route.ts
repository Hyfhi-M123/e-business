import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SHUTDOWN_FILE = path.join(process.cwd(), "shutdown.json");

export async function POST(req: Request) {
  try {
    const { shutdown } = await req.json();
    fs.writeFileSync(SHUTDOWN_FILE, JSON.stringify({ shutdown }));
    return NextResponse.json({ success: true, shutdown });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to write shutdown state" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (fs.existsSync(SHUTDOWN_FILE)) {
      const data = fs.readFileSync(SHUTDOWN_FILE, "utf-8");
      return NextResponse.json(JSON.parse(data));
    }
    return NextResponse.json({ shutdown: false });
  } catch (error) {
    return NextResponse.json({ shutdown: false });
  }
}
