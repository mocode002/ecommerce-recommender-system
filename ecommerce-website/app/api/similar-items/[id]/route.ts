import { NextResponse } from "next/server"
import { mockSimilarItems, mockProducts } from "@/app/lib/mock-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const similarItemsData = mockSimilarItems.find((s) => s._id === params.id)

    if (!similarItemsData) {
      return NextResponse.json([])
    }

    const similarProducts = mockProducts.filter((p) => similarItemsData.similar_items.includes(p._id))

    return NextResponse.json(similarProducts)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch similar items" }, { status: 500 })
  }
}
