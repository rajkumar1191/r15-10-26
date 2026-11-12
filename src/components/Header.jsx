import { memo } from "react";

const Header = ({ title }) => {
  console.log("header component");
  return (
    <header>
      <h1>{title}</h1>
      <p>Learn React Components</p>
    </header>
  );
};

export default memo(Header);
