import { ReactNode } from "react";

type ButtonProps = {
  title: string;
  children: ReactNode;
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      title={props.title}
      className="rounded-lg border border-transparent p-2 text-base font-semibold bg-[#1a1a1a] cursor-pointer transition-border duration-200 ease-in ml-auto hover:border-[#646cff] focus:ring focus:ring-webkit-focus-ring-color"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export { Button };
