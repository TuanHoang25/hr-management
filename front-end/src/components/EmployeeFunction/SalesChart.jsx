import QRCode from "qrcode.react";

const TestQRCode = () => {
  return (
    <div>
      <h1>Test QR Code</h1>
      <QRCode value="Hello, World!" />
    </div>
  );
};

export default TestQRCode;
