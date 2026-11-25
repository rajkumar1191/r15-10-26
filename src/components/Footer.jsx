import { ThemeContext } from "../context/ThemeContext";

// <Context.Consumer> is the older way to read a context (before hooks).
// Its child is a function that receives the current value.
// In function components prefer useContext(); Consumer is shown here so you
// can recognise it in older code.
const Footer = () => {
  return (
    <ThemeContext.Consumer>
      {({ theme }) => <footer>Footer - current theme: {theme}</footer>}
    </ThemeContext.Consumer>
  );
};

export default Footer;
