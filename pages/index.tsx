import type { NextPage } from "next";
import Layout from "@components/layout";
import FloatingButton from "@components/floating-button";
import Picture from "@components/picture";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWR from "swr";
import { Product } from "@prisma/client";

export interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ProductsResponse>("/api/pictures");
  return (
    <Layout title="홈" hasTabBar seoTitle="Home">
      <Head>
        <title>Home</title>
      </Head>
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="flex flex-col space-y-5 px-4">
          {data?.products
            ?.slice(0)
            .reverse()
            .map((product) => (
              <Picture
                id={product.id}
                key={product.id}
                title={product.name}
                mbti={product.mbti}
                age={product.age}
                hearts={product._count.favs}
                image={product.image}
              />
            ))}
          <FloatingButton href="/pictures/upload">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </FloatingButton>
        </div>
      )}
    </Layout>
  );
};
export default Home;
