import client from '../lib/sanityClient'
import Link from 'next/link';
import Image from "next/image";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Define the type for a product
interface Product {
  _id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  tags: string[];
  imageUrl: string;
  description: string;
  rating?: number;
  ratingCount?: number;
}

// GROQ Query to Fetch All Products
async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product"]{
    _id,
    name,
    price,
    discountPercentage,
    tags,
    "imageUrl": image.asset->url,
    description,
    rating,
    ratingCount
  }`;
  return await client.fetch(query);
}

// Function to group products by their tags
function groupProductsByTags(products: Product[]): Record<string, Product[]> {
  return products.reduce((acc: Record<string, Product[]>, product) => {
    product.tags.forEach((tag) => {
      if (!acc[tag]) acc[tag] = [];
      acc[tag].push(product);
    });
    return acc;
  }, {});
}

// Page Component
export default async function Home() {
  const products = await getProducts();
  const groupedProducts = groupProductsByTags(products);

  if (products.length === 0) {
    return (
      <main className="bg-gray-50 min-h-screen p-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          No Products Available
        </h1>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen p-10">
      <h1 className="text-4xl font-bold text-center my-8">Fake Store API Products</h1>

      {/* Iterate over the grouped products */}
      {Object.entries(groupedProducts).map(([tag, products]) => (
        <section key={tag} className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 capitalize">
            {tag}
          </h2>
          <Carousel>
            <CarouselContent>
              {Array.from({ length: Math.ceil(products.length / 4) }).map(
                (_, index) => (
                  <CarouselItem key={index}>
                    <div className="flex flex-wrap justify-center gap-4 py-6">
                      {products
                        .slice(index * 4, index * 4 + 4)
                        .map((product) => (
                          <Card
                            key={product._id}
                            className="w-full sm:w-48 md:w-56 lg:w-64 border rounded-lg shadow-md bg-white p-4 flex flex-col transform transition-transform hover:scale-105 hover:shadow-lg"
                          >
                            <Link href={`/products/${product._id}`}>
                              
                                <div className="w-full overflow-hidden rounded-t-md">
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    width={300}
                                    height={200}
                                    className="object-contain w-full h-40"
                                  />
                                </div>
                                <CardContent className="flex flex-col mt-4">
                                  <h3 className="text-lg font-semibold truncate">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {product.description}
                                  </p>
                                  <div className="flex justify-between items-center mt-2">
                                    <p className="text-blue-500 font-bold">
                                      ${product.price.toFixed(2)}
                                    </p>
                                    {product.discountPercentage && (
                                      <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                                        {product.discountPercentage}% OFF
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                    {product.rating && (
                                      <span>
                                        Rating: {product.rating.toFixed(1)} ⭐
                                      </span>
                                    )}
                                    {product.ratingCount && (
                                      <span>
                                        ({product.ratingCount} ratings)
                                      </span>
                                    )}
                                  </div>
                                </CardContent>
                              
                            </Link>
                          </Card>
                        ))}
                    </div>
                  </CarouselItem>
                )
              )}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 left-2 transform -translate-y-1/2 z-10 bg-gray-200 rounded-full p-2 hover:bg-gray-300" />
            <CarouselNext className="absolute top-1/2 right-2 transform -translate-y-1/2 z-10 bg-gray-200 rounded-full p-2 hover:bg-gray-300" />
          </Carousel>
        </section>
      ))}
    </main>
  );
}
