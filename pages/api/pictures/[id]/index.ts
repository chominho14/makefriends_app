import { withIronSessionApiRoute } from "iron-session/next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

// 나이가 아래 위로 2살까지 검색가능하도록 만든 코드
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;
  const product = await client.product.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const strAge = product?.age + "";

  const intAges = strAge.split(" ").map((age) => ({
    age: {
      lte: +age + 2,
      gte: +age - 2,
    },
  }));

  const relatedAges = await client.product.findMany({
    where: {
      OR: intAges,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  const sameMbti = product?.mbti.split(" ").map((word) => ({
    mbti: {
      contains: word,
    },
  }));

  const relatedMbti = await client.product.findMany({
    where: {
      OR: sameMbti,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });

  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  res.json({
    ok: true,
    product,
    isLiked,
    relatedAges,
    relatedMbti,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
