import { Star } from "lucide-react"
import type { Review } from "@/app/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review this product!</div>
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, index) => (
        <Card key={`${review.reviewerID}-${index}`}>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarFallback>
                  {review.reviewerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{review.reviewerName}</h4>
                  <span className="text-sm text-gray-500">{review.reviewTime}</span>
                </div>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.overall ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{review.overall}/5</span>
                </div>
                <p className="text-gray-700">{review.reviewText}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
