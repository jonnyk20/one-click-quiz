import React from "react";
import "./Button.scss";

type PropTypes = {
  onClick: (event: any) => void;
  children: React.ReactNode;
};

const Button: React.SFC<PropTypes> = ({ onClick, children }) => (
  <div className="button" onClick={onClick}>
    {children}
  </div>
);

export default Button;
