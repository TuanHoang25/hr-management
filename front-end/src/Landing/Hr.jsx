import ProfilePic from "../assets/john-doe-image.png";
import { AiFillStar } from "react-icons/ai";

const Testimonial = () => {
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Nhân sự</p>
        <h1 className="primary-heading">Giới thiệu nhân sự</h1>
        <p className="primary-text">
          Senior developer tại Google, có nhiều năm kinh nghiệm và là một trong
          những nhà phát triển của Google.
        </p>
      </div>
      <div className="testimonial-section-bottom">
        <img src={ProfilePic} alt="" />
        <p>
          Nhu cầu quản lý nhân sự ngày nay rất quan trọng với số lượng ứng viên
          ngày càng đông và mô hình quản lý ngày càng phức tạp.Việc xây dựng
          website nhân sự là rất quan trọng để quản lý nhân sự ngày càng tốt.
        </p>
        <div className="testimonials-stars-container">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>
        <h2>Judai</h2>
      </div>
    </div>
  );
};

export default Testimonial;
