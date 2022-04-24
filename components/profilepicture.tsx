import Link from "next/link";

interface PictureProps {
  title: string;
  id: number;
  age: number;
  mbti: string;
  description: string;
}

export default function Picture({
  title,
  age,
  mbti,
  id,
  description,
}: PictureProps) {
  return (
    <Link href={`/pictures/${id}`}>
      <a className="flex cursor-pointer justify-between px-4 pt-5">
        <div className="flex space-x-4">
          <div className="h-20 w-20 rounded-md bg-gray-400" />
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
      </a>
    </Link>
  );
}
