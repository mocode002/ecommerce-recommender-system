import { NextResponse } from "next/server"
import { mockReviews } from "@/app/lib/mock-data"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product_id, user_id, user_name, rating, comment } = body

    const newReview = {
      _id: `rev_${Date.now()}`,
      product_id,
      user_id,
      user_name,
      rating: Number.parseInt(rating),
      comment,
      date: new Date().toISOString().split("T")[0],
    }

    mockReviews.push(newReview)

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
