import AboutBackground from "../assets/about-background.png";
import AboutBackgroundImage from "../assets/aboutImage.png";
import { BsFillPlayCircleFill } from "react-icons/bs";

const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">Về chúng tôi</p>
        <h1 className="primary-heading">Hệ thống website quản lý nhân sự</h1>
        <p className="primary-text">
          Chúng tôi là nhóm những sinh viên năm 4 từ trường Đại Học Công Nghệ
          TPHCM
        </p>
        <p className="primary-text">
          Chúng tôi lập ra website quản lý nhân sự với mong muốn tăng cường hiệu
          quả quản lý và cải thiện quy trình làm việc trong các doanh nghiệp
          công ty hiện nay
        </p>
        <div className="about-buttons-container">
          <button className="secondary-button">Tìm hiểu thêm</button>
          <button className="watch-video-button">
            <BsFillPlayCircleFill /> Xem Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
