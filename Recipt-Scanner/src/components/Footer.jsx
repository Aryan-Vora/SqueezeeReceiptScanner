import "./Footer.css";
import HomeIcon from "../assets/Home.svg";
import ShoppingIcon from "../assets/Shopping.svg";
import DefaultProfilePicture from "../assets/DefaultProfilePicture.png";
import PropTypes from "prop-types";
const Footer = ({
  customFunction1,
  customFunction2,
  customFunction3,
  ProfilePicture,
}) => {
  return (
    <div className="container">
      <div className="icon" onClick={customFunction1}>
        <img src={HomeIcon} width="32" height="32" alt="Home Icon" />
      </div>
      <div className="icon" onClick={customFunction2}>
        <img src={ShoppingIcon} width="32" height="32" alt="Shopping Icon" />
      </div>
      <div className="icon" onClick={customFunction3}>
        <img src={ProfilePicture} width="32" height="32" alt="Profile Icon" />
      </div>
    </div>
  );
};

Footer.propTypes = {
  customFunction1: PropTypes.func,
  customFunction2: PropTypes.func,
  customFunction3: PropTypes.func,
  ProfilePicture: PropTypes.string,
};

Footer.defaultProps = {
  customFunction1: () => {},
  customFunction2: () => {},
  customFunction3: () => {},
  ProfilePicture: DefaultProfilePicture,
};

export default Footer;
