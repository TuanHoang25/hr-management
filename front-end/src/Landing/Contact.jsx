const Contact = () => {
  return (
    <div className="contact-page-wrapper">
      <h1 className="primary-heading">Bạn muốn có câu hỏi gì cho chúng tôi không?</h1>
      <h1 className="primary-heading">Hãy cho chúng tôi biết</h1>
      <div className="contact-form-container">
        <input type="text" placeholder="your@gmail.com" />
        <button className="secondary-button">Gửi</button>
      </div>
    </div>
  );
};

export default Contact;
