import client from '../../../lib/sanityClient';
import Image from "next/image";

// Define the type for a single product
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

// GROQ Query to Fetch a Product by ID
async function getProductById(id: string): Promise<Product | null> {
  const query = `*[_type == "product" && _id == $id][0]{
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
  return await client.fetch(query, { id });
}

// Dynamic Product Page Component
export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params; // Awaiting the `params` dynamically
  const product = await getProductById(id);

  if (!product) {
    return (
      <main className="bg-gray-50 min-h-screen p-10 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-700">Product Not Found</h1>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen p-10">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={300}
              className="object-contain rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xl text-blue-500 font-bold">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage && (
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            {product.rating && (
              <p className="text-gray-600">
                Rating: <span className="font-semibold">{product.rating}</span> ⭐{" "}
                {product.ratingCount && (
                  <span>({product.ratingCount} reviews)</span>
                )}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
