
import { Home } from "./home/Home";




export default async function Page() {
  async function getData() {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`);
      const data = await response.json();

      return data

    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  const products = await getData();
  return <Home products={products} />;
}