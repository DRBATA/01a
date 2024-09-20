import { FC, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  [key: string]: any;
}

const Button: FC<ButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
  >
    {children}
  </button>
);

export default Button;
