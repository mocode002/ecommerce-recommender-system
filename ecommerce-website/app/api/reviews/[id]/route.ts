import { NextResponse } from "next/server"
import { mockReviews } from "@/app/lib/mock-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const reviews = mockReviews.filter((r) => r.product_id === params.id)
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
