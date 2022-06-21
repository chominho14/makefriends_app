import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";
import mail from "@sendgrid/mail";

// Sendgrid 메일 보내기
mail.setApiKey(process.env.SENDGRID_API_KEY!);

// nodemailer 사용하여 메일 보내기
// npm install nodemailer (설치)
// const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_ID,
//     pass: process.env.GMAIL_PWD,
//   },
// });

// twilio 설정
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone: phone } : email ? { email } : null;

  if (!user) return res.status(400).json({ ok: false });

  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  console.log(token);
  if (phone) {
    const message = await twilioClient.messages.create({
      messagingServiceSid: process.env.TWILIO_MSID,
      to: process.env.PHONE_NUMBER!,
      body: `Your login token is ${payload}.`,
    });
    console.log(message);
  } else if (email) {
    // twilio 보내는 로직
    const email = await mail.send({
      from: "chominho14@naver.com",
      to: "chominho14@naver.com",
      subject: "Your MakefriendsApp Verification Email",
      text: `Your token is ${payload}`,
      html: `<strong>Your token is ${payload}</strong>`,
    });
    // // nodemailer Email 보내기
    // const sendEmail = await transporter
    //   .sendMail({
    //     from: `ABC <whalsgh15@gmail.com>`,
    //     to: email,
    //     subject: "Your MakefriendsApp Token",
    //     text: `your login token is ${payload}`,
    //     html: `
    //     <div style="text-align: center;">
    //       <h3 style="color: #FA5882">ABC</h3>
    //       <br />
    //       <p>your login token is ${payload}</p>
    //     </div>
    // `,
    //   })
    //   .then((result: any) => console.log(result))
    //   .catch((err: any) => console.log(err));
    // console.log(email);
  }
  return res.status(200).json({
    ok: true,
  });
}
export default withHandler({ methods: ["POST"], handler, isPrivate: false });
