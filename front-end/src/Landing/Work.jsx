import Secretary from "../assets/secretary.png";
import Developer from "../assets/developer.png";
import Marketing from "../assets/marketing.png";

const Work = () => {
  const workInfoData = [
    {
      image: Secretary,
      title: "Thư ký",
      text: "Quản lý lịch trình, hỗ trợ tổ chức các cuộc họp, xử lý văn bản, và đảm bảo luồng thông tin nội bộ trong công ty diễn ra hiệu quả.",
    },
    {
      image: Developer,
      title: "Lập trình viên",
      text: "Thiết kế, phát triển, đóng gói và bảo trì ,kiểm thử các hệ thống quản lý nhân sự, đảm bảo tính bảo mật và hiệu suất các ứng dụng trong công ty.",
    },
    {
      image: Marketing,
      title: "NV tiếp thị",
      text: "Lập kế hoạch và triển khai các chiến dịch quảng bá, xây dựng thương hiệu công ty và thu hút khách hàng",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Công việc</p>
        <h1 className="primary-heading">Giới thiệu công việc</h1>
        <p className="primary-text">
          Một số vị trí trong công ty nhân sự cùng mô tả cơ bản về nhiệm vụ ,công việc của những vị trí này
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
