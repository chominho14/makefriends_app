import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface Post {
  title: string;
  data: string;
  category: string;
  date: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout title="Blog" seoTitle="Blog">
      <h1 className="my-10 mt-5 text-center text-xl font-semibold">
        MakeFriendsApp
      </h1>
      <ul>
        {posts.map((post, index) => (
          <div key={index} className="mb-4 flex flex-col">
            <Link href={`/blog/${post.slug}`}>
              <a className="block px-4 pt-1 text-gray-500">
                <div className="relative w-full rounded-md bg-gray-200 px-7 py-5 shadow-sm transition duration-700 ease-in-out hover:-translate-y-1 hover:bg-slate-400 hover:text-white">
                  <span className="text-lg font-bold text-gray-600">
                    {post.title}
                  </span>
                  <div className="my-2">
                    <span className="">{post.data}</span>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </ul>
    </Layout>
  );
};

export async function getStaticProps() {
  // nodejs 사용하여 posts에 있는 파일들 가져오기
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    // md 지우기
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug };
  });
  console.log(blogPosts);
  return {
    props: {
      posts: blogPosts,
    },
  };
}

export default Blog;
