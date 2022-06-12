import { cls } from "@libs/client/utils";
import Image from "next/image";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex  items-start",
        reversed ? "flex-row-reverse space-x-reverse" : "space-x-2"
      )}
    >
      {avatarUrl ? (
        <Image
          width={40}
          height={40}
          src={`https://imagedelivery.net/gW7iMYc8PRF7ooz9ysBNKw/${avatarUrl}/avatar`}
          className="h-8 w-8 rounded-full"
          alt="chat-avartar"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-slate-400" />
      )}
      <div className="w-1/2 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
    </div>
  );
}
