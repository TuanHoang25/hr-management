import BannerBackground from "../assets/home-banner-background.png";
import BannerImage from "../assets/home-banner-group.jpeg";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const handleNavigateApply = () => {
    navigate("/apply");
  };
  return (
    <div className="home-banner-container">
      <div className="home-bannerImage-container">
        <img src={BannerBackground} alt="" />
      </div>
      <div className="home-text-section">
        <h1 className="primary-heading">Chào mừng đến với Website</h1>
        <p className="primary-text">
          Website tuyển dụng nhân sự hàng đầu thế giới,nơi giao thoa của khoa
          học - công nghệ,kinh tế - tài chính
        </p>
        <button className="secondary-button" onClick={handleNavigateApply}>
          Ứng tuyển ngay <FiArrowRight />{" "}
        </button>
      </div>
      <div className="home-image-section">
        <img src={BannerImage} alt="" />
      </div>
    </div>
  );
};

export default Home;
