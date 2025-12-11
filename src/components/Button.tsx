import React from "react";

type ButtonProps = {
  text: String | React.ReactNode;
  className: String;
  onClickFunc?: () => void;
};

export default function Button({ text, className, onClickFunc }: ButtonProps) {
  return (
    <>
      <button
        onClick={onClickFunc}
        className={`bg-rose-500 text-white relative h-12 w-full overflow-hidden rounded-lg px-4 py-2 text-base font-medium outline-none lg:px-9 lg:text-md ${className}`}
      >
        <span className="">{text}</span>
      </button>
    </>
  );
}
