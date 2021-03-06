import Image from "next/image";
import Link from "next/link";

interface PictureProps {
  title: string;
  id: number;
  age: number;
  mbti: string;
  description: string;
  image: string;
  hearts: number;
}

export default function Picture({
  title,
  age,
  mbti,
  id,
  image,
  description,
  hearts,
}: PictureProps) {
  return (
    <Link href={`/pictures/${id}`}>
      <a className="flex w-full cursor-pointer justify-between px-4 pt-5">
        <div className="flex space-x-4">
          <Image
            width={80}
            height={80}
            src={`https://imagedelivery.net/gW7iMYc8PRF7ooz9ysBNKw/${image}/list`}
            className="h-20 w-20 rounded-md bg-gray-400"
          />
          <div className="flex flex-col pt-2">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <span className="mt-1 text-xs font-medium text-gray-900">
              {age}세, {mbti}
            </span>
            <span className="mt-1 text-xs font-medium text-gray-900">
              {description.length >= 20
                ? description.substring(0, 20) + "..."
                : description}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-end space-x-2">
          <div className="ml-20 flex items-center space-x-0.5 text-sm  text-gray-600">
            <svg
              className="h-4 w-4"
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
            <span>{hearts}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}
