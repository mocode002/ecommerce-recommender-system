"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import type { Product, Review } from "@/app/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ReviewForm from "@/app/components/ReviewForm"
import ReviewList from "@/app/components/ReviewList"
import ProductCard from "@/app/components/ProductCard"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchProductData()
  }, [id])

  const fetchProductData = async () => {
    try {
      setLoading(true)

      // Fetch product details
      const productRes = await fetch(`http://localhost:8000/products/${id}`)
      if (productRes.ok) {
        const productData = await productRes.json()
        setProduct(productData)
      }

      // Fetch reviews
      const reviewsRes = await fetch(`http://localhost:8000/reviews/${id}`)
      if (reviewsRes.ok) {
        const reviewsData = await reviewsRes.json()
        setReviews(reviewsData.reviews || [])
      }

      // Fetch similar items
      const similarRes = await fetch(`http://localhost:8000/similar-items/${id}`)
      if (similarRes.ok) {
        const similarData = await similarRes.json()
        setSimilarProducts(similarData)
      }
    } catch (error) {
      console.error("Error fetching product data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewSubmitted = () => {
    fetchProductData() // Refresh reviews after submission
  }

  const calculateAverageRating = () => {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0
  const sum = reviews.reduce((acc, review) => acc + review.overall, 0)
  return (sum / reviews.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.imageURLHighRes[selectedImage] || "/placeholder.svg?height=600&width=600"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          {product.imageURLHighRes.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.imageURLHighRes.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg?height=80&width=80"}
                    alt={`${product.title} ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.brand}
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(Number.parseFloat(calculateAverageRating()))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {calculateAverageRating()} ({reviews.length} reviews)
                </span>
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-6">{product.cleaned_price || product.price}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{product.description[0]}</p>
          </div>

          {product.feature.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {product.feature.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex space-x-4">
            <Button size="lg" className="flex-1">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews ({reviews.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewList reviews={reviews} />
            </CardContent>
          </Card>
        </div>

        <div>
          <ReviewForm productId={product._id} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <>
          <Separator className="my-12" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct._id} product={similarProduct} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
