import HrLogo from "../assets/HrText.svg";
import { BsTwitter } from "react-icons/bs";
import { SiLinkedin } from "react-icons/si";
import { BsYoutube } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer-section-one">
        <div className="footer-logo-container">
          <img src={HrLogo} alt="" />
        </div>
        <div className="footer-icons">
          <BsTwitter />
          <SiLinkedin />
          <BsYoutube />
          <FaFacebookF />
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span>Chất lượng</span>
          <span>Giúp đỡ</span>
          <span>Chia sẻ</span>
          <span>Quan tâm</span>
          <span>Công việc</span>
          
        </div>
        <div className="footer-section-columns">
          <span>0937183556</span>
          <span>tuanhoang2500@gmail.com</span>
          <span>annguyen240303@gmail.com</span>
          <span>thanhdangvan231@gmail.com</span>
        </div>
        <div className="footer-section-columns">
          <span>Điều khoản & Giấy phép</span>
          <span>Chính sách bảo mật</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
