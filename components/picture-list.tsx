import { ProductWithCount } from "pages";
import useSWR from "swr";
import Picture from "./picture";

interface PictureListProps {
  kind: "favs";
}

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  [key: string]: Record[];
}

export default function PictureList({ kind }: PictureListProps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Picture
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          age={record.product.age}
          mbti={record.product.mbti}
          hearts={record.product._count.favs}
          image={record.product.image}
        />
      ))}
    </>
  ) : null;
}
