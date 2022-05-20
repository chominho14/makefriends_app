import type { NextPage } from "next";
import Item from "@components/picture";
import Layout from "@components/layout";
import Picture from "@components/picture";
import PictureList from "@components/picture-list";

const Loved: NextPage = () => {
  return (
    <Layout title="관심목록" canGoBack>
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        <PictureList kind="favs" />
      </div>
    </Layout>
  );
};

export default Loved;
