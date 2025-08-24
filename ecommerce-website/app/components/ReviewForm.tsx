"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReviewFormProps {
  productId: string
  onReviewSubmitted: () => void
}

export default function ReviewForm({ productId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)

  // Get current user from localStorage or context (simplified for demo)
  const getCurrentUser = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("currentUser")
      return userData ? JSON.parse(userData) : { id: "A1E4V90E56F4MK", name: "Abdullah" }
    }
    return { id: "A1E4V90E56F4MK", name: "Abdullah" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !comment.trim()) return

    setIsSubmitting(true)
    const currentUser = getCurrentUser()

    // Format date as MM DD, YYYY
    const now = new Date()
    const formattedDate = now
      .toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, " ")
      .replace(/(\d{2}) (\d{2}) (\d{4})/, "$1 $2, $3")

      console.log("Submitting review:", {
                  _id: productId,
          review: {
            overall: rating,
            reviewText: comment.trim(),
            reviewTime: formattedDate,
            reviewerID: currentUser.id,
            reviewerName: currentUser.name,
          }})

    try {
      const response = await fetch("http://localhost:8000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: productId,
          review: {
            overall: rating,
            reviewText: comment.trim(),
            reviewTime: formattedDate,
            reviewerID: currentUser.id,
            reviewerName: currentUser.name,
          }
        }),
      })

      if (response.ok) {
        setRating(0)
        setComment("")
        onReviewSubmitted()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-2">
              Review
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" disabled={rating === 0 || !comment.trim() || isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
