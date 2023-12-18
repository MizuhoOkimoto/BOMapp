import "./Header.css";
//import logo from "../img/logo.png";
import logo from "../img/logo_BOM.png";

function Header() {
  return (
    <div className="header-container">
      <img src={logo} alt="Company logo" className="logo" />
      <h2 className="header-text">BOM Master - Visual Parts Management</h2>
    </div>
  );
}

export default Header;
