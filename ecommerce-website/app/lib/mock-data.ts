import type { Product, Review, SimilarItems } from "./types"

export const mockProducts: Product[] = [
  {
    _id: "B011SY9KEI",
    category: ["Appliances", "Dishwashers", "Built-In Dishwashers"],
    description: [
      "Stainless Steel Tub 6 Wash Cycles ProScrub Option Clean Water Wash System SatinGlide Max Rails (Upper Rack) Sliding Tines In The Lower Rack Utility Basket (Upper Rack) 44 dbl Stainless Steel Finish Among leading premium brands, with rinse aid.",
    ],
    title: "Kitchen Aid KDTM354ESS Stainless Steel Tub Built-in Stainless Dishwasher",
    feature: [
      "Stainless Steel Tub Interior W/ Nylon Rack",
      "6 Wash Cycles / 7 Options",
      "15 Place Settings Capacity",
      "Clean Water Wash System Continuously Removes Food Particles",
    ],
    brand: "KitchenAid",
    main_cat: "Appliances",
    price: "$899.99",
    imageURLHighRes: [
      "https://images-na.ssl-images-amazon.com/images/I/51Vz4cIP1bL.jpg",
      "https://images-na.ssl-images-amazon.com/images/I/511BrlkrqqL.jpg",
    ],
    cleaned_price: "$899.99",
  },
  {
    _id: "B00CT71N80",
    category: ["Appliances", "Range Parts"],
    description: ['2287 PREMIER 8" INFINITE SWITCH'],
    title: 'Peerless Premier Range Oven Cooktop 8" Infinite Top Burner SWITCH 2287',
    feature: ["8 Inch Infinite Switch", "Compatible with Premier Ranges"],
    brand: "Peerless",
    main_cat: "Appliances",
    price: "$15.00",
    imageURLHighRes: [
      "https://images-na.ssl-images-amazon.com/images/I/31JY0EsoorL.jpg",
      "https://images-na.ssl-images-amazon.com/images/I/41nzWKqEH%2BL.jpg",
    ],
    cleaned_price: "$15.00",
  },
  {
    _id: "B0006FU1IU",
    category: ["Kitchen", "Small Appliances"],
    description: ["High-quality kitchen appliance for modern homes"],
    title: "Premium Kitchen Appliance Set",
    feature: ["Durable Construction", "Easy to Clean", "Energy Efficient"],
    brand: "Premium",
    main_cat: "Kitchen",
    price: "$299.99",
    imageURLHighRes: ["/placeholder.svg?height=300&width=300"],
    cleaned_price: "$299.99",
  },
]

export const mockReviews: Review[] = [
  {
    _id: "rev1",
    product_id: "B011SY9KEI",
    user_id: "user1",
    user_name: "John Doe",
    rating: 5,
    comment: "Excellent dishwasher! Very quiet and cleans dishes perfectly.",
    date: "2024-01-15",
  },
  {
    _id: "rev2",
    product_id: "B011SY9KEI",
    user_id: "user2",
    user_name: "Jane Smith",
    rating: 4,
    comment: "Great product, but installation was a bit tricky.",
    date: "2024-01-10",
  },
]

export const mockSimilarItems: SimilarItems[] = [
  {
    _id: "B0006FU1IU",
    similar_items: ["B011SY9KEI", "B00CT71N80"],
  },
  {
    _id: "B011SY9KEI",
    similar_items: ["B0006FU1IU", "B00CT71N80"],
  },
]
