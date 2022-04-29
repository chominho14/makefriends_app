import { withIronSessionApiRoute } from "iron-session/next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;
  const profile = await client.user.findUnique({
    where: {
      id: req.session.user?.id,
    },
    include: {
      products: {
        include: {
          _count: {
            select: {
              favs: true,
            },
          },
        },
      },
      posts: {
        include: {
          _count: {
            select: {
              wondering: true,
              answers: true,
            },
          },
        },
      },
    },
  });
  res.json({
    ok: true,
    profile,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
