import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import useUser from "@libs/client/useUser";
import { Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import Image from "next/image";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedAges: Product[];
  isLiked: boolean;
  relatedMbti: Product[];
}

const PictureDetail: NextPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/pictures/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/pictures/${router.query.id}/fav`);
  const onFavClick = () => {
    if (!data) return;
    boundMutate((prev) => prev && { ...prev, isLiked: !prev.isLiked }, false);
    // mutate("api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    toggleFav({});
  };
  return (
    <Layout canGoBack seoTitle="Post Detail">
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="relative pb-80">
            <Image
              src={`https://imagedelivery.net/gW7iMYc8PRF7ooz9ysBNKw/${data?.product.image}/public`}
              className=" bg-slate-300 object-cover"
              layout="fill"
            />
          </div>
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            {data?.product?.user?.avatar ? (
              <Image
                width={48}
                height={48}
                src={`https://imagedelivery.net/gW7iMYc8PRF7ooz9ysBNKw/${data?.product?.user?.avatar}/avatar`}
                className="h-16 w-16 rounded-full bg-slate-500"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-slate-500" />
            )}
            <div>
              {isLoading ? (
                "Loading..."
              ) : (
                <p className="text-sm font-medium text-gray-700">
                  {data?.product?.user?.name}
                </p>
              )}
              <Link href={`/users/profiles/${data?.product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            {isLoading ? (
              "Loading..."
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">
                {data?.product?.name}
              </h1>
            )}
            {isLoading ? (
              "Loading..."
            ) : (
              <span className="mt-3 block text-2xl text-gray-900">
                {data?.product?.age}???, {data?.product?.mbti}
              </span>
            )}
            {isLoading ? (
              "Loading..."
            ) : (
              <p className="my-6 text-gray-700">{data?.product?.description}</p>
            )}
            <div className="flex items-center justify-between space-x-2">
              <Button large text="????????????" />
              <button
                onClick={onFavClick}
                className={cls(
                  "flex items-center justify-center rounded-md p-3 hover:bg-gray-100 ",
                  data?.isLiked
                    ? "text-red-500  hover:text-red-600"
                    : "text-gray-400 hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          {data?.relatedAges.length == 0 ? (
            ""
          ) : (
            <h2 className="text-2xl font-bold text-gray-900">Another People</h2>
          )}
          <div className="  mt-6 grid grid-cols-2 gap-4">
            {data?.relatedAges.map((product) => (
              <Link key={product.id} href={`/pictures/${product?.id}`}>
                <a>
                  <div>
                    <Image
                      width={230}
                      height={230}
                      src={`https://imagedelivery.net/gW7iMYc8PRF7ooz9ysBNKw/${product.image}/similarpost`}
                      className="mb-4 h-56 w-full bg-slate-300"
                    />
                    <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                    <span className="text-xs font-medium text-gray-900">
                      {product.age}???
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
        <div>
          {data?.relatedMbti?.length == 0 ? (
            ""
          ) : (
            <h2 className="text-2xl font-bold text-gray-900">Same MBTI</h2>
          )}
          <div className="  mt-6 grid grid-cols-2 gap-4">
            {data?.relatedMbti?.map((product) => (
              <Link key={product.id} href={`/pictures/${product?.id}`}>
                <a>
                  <div>
                    <Image
                      width={230}
                      height={230}
                      src={`https://imagedelivery.net/gW7iMYc8PRF7ooz9ysBNKw/${product.image}/similarpost`}
                      className="mb-4 h-56 w-full bg-slate-300"
                    />
                    <h3 className="-mb-1 text-gray-700">{product?.name}</h3>
                    <span className="text-xs font-medium text-gray-900">
                      {product.age}???
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PictureDetail;
