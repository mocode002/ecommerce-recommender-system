import { NextResponse } from "next/server"
import { mockProducts } from "@/app/lib/mock-data"

export async function GET() {
  try {
    return NextResponse.json(mockProducts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
