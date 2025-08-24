export interface Product {
  _id: string
  category: string[]
  description: string[]
  title: string
  feature: string[]
  brand: string
  main_cat: string
  price: string
  imageURLHighRes: string[]
  cleaned_price: string
}

export interface Review {
  _id?: string
  product_id?: string
  overall: number
  reviewText: string
  reviewTime: string
  reviewerID: string
  reviewerName: string
}

export interface ReviewsResponse {
  reviews: Review[]
}

export interface SimilarItems {
  _id: string
  similar_items: string[]
}
