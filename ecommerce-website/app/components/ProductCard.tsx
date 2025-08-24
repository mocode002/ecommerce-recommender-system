import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/app/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <Link href={`/products/${product._id}`}>
        <CardContent className="p-4">
          <div className="aspect-square relative mb-4 overflow-hidden rounded-lg">
            <Image
              src={product.imageURLHighRes[0] || "/placeholder.svg?height=300&width=300"}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <Badge variant="secondary" className="mb-2">
            {product.brand}
          </Badge>
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.title}</h3>
          <p className="text-xs text-gray-600 line-clamp-2 mb-2">{product.description[0]}</p>
        </CardContent>
        <CardFooter className="pt-0 px-4 pb-4">
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-bold text-green-600">{product.cleaned_price || product.price}</span>
            <Badge variant="outline">{product.main_cat}</Badge>
          </div>
        </CardFooter>
      </Link>
    </Card>
  )
}
