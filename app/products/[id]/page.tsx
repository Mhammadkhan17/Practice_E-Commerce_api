import { GetStaticProps, GetStaticPaths } from "next";
import client from "../../../lib/sanityClient";
import Image from "next/image";

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

interface ProductPageProps {
  product: Product;
}

// GROQ Query to Fetch a Single Product
const getProductById = async (id: string): Promise<Product> => {
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

  return client.fetch(query, { id });
};

// Dynamic Route Component
export default function ProductPage({ product }: ProductPageProps) {
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={500}
              height={500}
              className="rounded-md"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 md:pl-6 mt-6 md:mt-0">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-2">{product.description}</p>

            <div className="mt-4">
              <p className="text-lg text-blue-600 font-bold">
                ${product.price.toFixed(2)}
              </p>
              {product.discountPercentage && (
                <p className="text-sm text-green-600 mt-2">
                  {product.discountPercentage}% OFF
                </p>
              )}
            </div>

            {product.rating && (
              <p className="text-sm text-gray-600 mt-4">
                Rating: {product.rating.toFixed(1)} ⭐ ({product.ratingCount}{" "}
                ratings)
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// Generate Dynamic Paths
export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "product"]{ _id }`;
  const products = await client.fetch<{ _id: string }[]>(query);

  const paths = products.map((product) => ({
    params: { id: product._id },
  }));

  return { paths, fallback: "blocking" };
};

// Fetch Data for Each Product
export const getStaticProps: GetStaticProps<ProductPageProps> = async ({
  params,
}) => {
  if (!params?.id || typeof params.id !== "string") {
    return { notFound: true };
  }

  const product = await getProductById(params.id);

  if (!product) {
    return { notFound: true };
  }

  return { props: { product } };
};
