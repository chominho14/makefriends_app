import { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  label?: string;
  name?: string;
  [key: string]: any;
  register: UseFormRegisterReturn;
}

export default function TextArea({
  label,
  name,
  register,
  ...rest
}: TextAreaProps) {
  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={name}
        {...register}
        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 "
        rows={4}
        {...rest}
      />
    </div>
  );
}
