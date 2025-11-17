import { type ButtonHTMLAttributes } from 'react';

import './Button.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  isSmall?: boolean;
  width?: number;
}

const Button = ({ children, className, isSmall, width, ...props }: ButtonProps) => {
  const buttonStyle = width 
    ? { width: `${width}rem`}
    : {};

  return (
    <button 
      className={`Button ${isSmall ? 'Button--isSmall' : ''} ${className || ''}`}
      style={buttonStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
