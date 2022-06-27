import type { NextPage, NextPageContext } from "next";
import Layout from "@components/layout";
import Link from "next/link";
import useUser from "@libs/client/useUser";
import useSWR, { SWRConfig } from "swr";
import { Post, Product, User } from "@prisma/client";
import ProfilePicture from "@components/profilepicture";
import Image from "next/image";
import { withSsrSession } from "@libs/server/withSession";
import client from "@libs/server/client";

interface ProductWithCounts extends Product {
  _count: {
    favs: number;
  };
}

interface PostWithUsers extends Post {
  user: User;
  _count: {
    wondering: number;
    answers: number;
  };
}

interface ProfileWithProductsAndPosts {
  user: User;
  products: ProductWithCounts[];
  posts: PostWithUsers[];
}

interface ProfileResponse {
  ok: boolean;
  profile: ProfileWithProductsAndPosts;
}

const Profile: NextPage = () => {
  const { user, isLoading } = useUser();
  const { data } = useSWR<ProfileResponse>("/api/users/me");
  return (
    <Layout hasTabBar title="나의 프로필" seoTitle="Profile">
      <div className="px-4">
        <div className="mt-4 flex items-center space-x-3">
          {user?.avatar ? (
            <Image
              width={48}
              height={48}
              src={`https://imagedelivery.net/gW7iMYc8PRF7ooz9ysBNKw/${data?.profile?.avatar}/avatar`}
              className="h-16 w-16 rounded-full bg-slate-500"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-slate-500" />
          )}
          {isLoading ? (
            "Loading..."
          ) : (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{user?.name}</span>
              <Link href="/profile/edit">
                <a className="text-sm text-gray-700">Edit profile &rarr;</a>
              </Link>
            </div>
          )}
        </div>
        <div className="mt-10 flex justify-around">
          <Link href="/profile/loved">
            <a className="flex w-full flex-col items-center">
              <div className="flex h-14 w-full items-center justify-center rounded-2xl bg-pink-400 text-white">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <span className="mt-2 text-sm font-medium text-gray-700">
                관심목록
              </span>
            </a>
          </Link>
        </div>
        <div className="mt-12">
          <div className="flex flex-col space-y-5 px-4 py-5">
            {data?.profile?.products.length == 0 ? (
              ""
            ) : (
              <>
                <hr />
                <h4 className="text-xl font-bold text-gray-900">
                  Uploaded Pictures
                </h4>
              </>
            )}
            <div>
              {data?.profile?.products
                ?.slice(0)
                .reverse()
                .map((product) => (
                  <ProfilePicture
                    id={product.id}
                    key={product.id}
                    title={product.name}
                    mbti={product.mbti}
                    image={product.image}
                    age={product.age}
                    description={product.description}
                    hearts={product._count.favs}
                  />
                ))}
            </div>
          </div>
          <div className="flex flex-col space-y-5 px-4 py-5">
            {data?.profile?.posts.length == 0 ? (
              ""
            ) : (
              <>
                <hr />
                <h4 className="text-xl font-bold text-gray-900">
                  Uploaded Posts
                </h4>
              </>
            )}
            <div className="space-y-4 divide-y-[2px]">
              {data?.profile?.posts
                ?.slice(0)
                .reverse()
                .map((post) => (
                  <Link key={post.id} href={`/community/${post.id}`}>
                    <a className="flex cursor-pointer flex-col items-start pt-4">
                      <div className="mt-2 px-4 text-gray-700">
                        <span className="font-medium text-pink-500">Q.</span>
                        {post.question.length >= 20
                          ? post.question.substring(0, 20)
                          : post.question}
                      </div>
                      <div className="mt-5 flex w-full items-center justify-between px-4 text-xs font-medium text-gray-500">
                        <span> </span>
                        <span>{post.createdAt}</span>
                      </div>
                      <div className="mt-3 flex w-full space-x-5 border-t px-4 py-2.5   text-gray-700"></div>
                    </a>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Page: NextPage<{ profile: User }> = ({ profile }) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/users/me": {
            ok: true,
            profile,
          },
        },
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

export const getServerSideProps = withSsrSession(async function ({
  req,
}: NextPageContext) {
  const profile = await client?.user.findUnique({
    where: { id: req?.session.user?.id },
  });
  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
    },
  };
});

export default Page;
