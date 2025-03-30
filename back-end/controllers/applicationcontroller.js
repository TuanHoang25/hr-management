import Application from '../models/Application.js';
import { sendEmail } from '../config/mailer.js';
import multer from 'multer';
import path from 'path';
import { jsPDF } from 'jspdf';
import fs from 'fs-extra';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/files'); // Đường dẫn lưu trữ hình ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
    },
});

const upload = multer({ storage: storage });

const createPDF = (application, fileName) => {
    const doc = new jsPDF();

    const fonts = {
        roboto: path.resolve("fonts/Roboto-Regular.ttf"),
        robotoBold: path.resolve("fonts/Roboto-Bold.ttf"),
        greatVibes: path.resolve("fonts/GreatVibes-Regular.ttf"),
    };

    // Kiểm tra các file font
    Object.entries(fonts).forEach(([name, fontPath]) => {
        if (!fs.existsSync(fontPath)) {
            throw new Error(`Font ${name} not found at ${fontPath}`);
        }
    });

    // Nhúng font vào jsPDF
    doc.addFileToVFS("Roboto-Regular.ttf", fs.readFileSync(fonts.roboto, "base64"));
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

    doc.addFileToVFS("Roboto-Bold.ttf", fs.readFileSync(fonts.robotoBold, "base64"));
    doc.addFont("Roboto-Bold.ttf", "Roboto-Bold", "bold");
    doc.addFont("Roboto-Bold.ttf", "Roboto-Bold", "normal");

    doc.addFileToVFS("GreatVibes-Regular.ttf", fs.readFileSync(fonts.greatVibes, "base64"));
    doc.addFont("GreatVibes-Regular.ttf", "GreatVibes", "normal");

    // const logoPath = path.resolve("public/pdf/logo.png");
    // if (fs.existsSync(logoPath)) {
    //     const logoData = fs.readFileSync(logoPath, { encoding: "base64" });
    //     doc.addImage(`data:image/png;base64,${logoData}`, "PNG", 10, 10, 40, 40);
    // } else {
    //     console.error("Logo file not found at:", logoPath);
    // }
    // --- A. Header ---
    doc.setFont("Roboto-Bold");
    doc.setFontSize(16);
    doc.text("Xác nhận thông tin ứng viên trúng tuyển", 50, 20);

    doc.setFont("Roboto");
    doc.setFontSize(12);
    doc.text(`Cảm ơn ${application.name} đã ứng tuyển vào công ty của chúng tôi.`, 10, 50);
    doc.text("Dưới đây là thông tin cá nhân mà bạn đã cung cấp.", 10, 60);

    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Thông tin cá nhân của bạn sẽ được bảo mật tuyệt đối theo chính sách của Công ty nhân sự T.", 10, 70);

    // --- B. Nội dung chính ---
    doc.setFont("Roboto");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Tên: ${application.name}`, 10, 90);
    doc.text(`Email: ${application.email}`, 10, 100);
    doc.text(`Số điện thoại: ${application.phone}`, 10, 110);
    doc.text(`Kì vọng ứng tuyển: ${application.aspiration}`, 10, 120);
    doc.text(`Chứng chỉ ngoại ngữ: ${application.languageCertificate}`, 10, 130);
    doc.text(`Chứng chỉ kỹ năng: ${application.skillCertificate}`, 10, 140);

    // --- C. Footer ---
    doc.setFont("Roboto");
    doc.setFontSize(12);
    doc.text(
        "Một lần nữa, chúng tôi cảm ơn sự quan tâm của bạn đối với cơ hội làm việc tại Công ty nhân sự T.",
        10,
        180
    );
    doc.text(
        "Chúng tôi mong chờ sự hợp tác và đóng góp của bạn trong thời gian sắp tới.",
        10,
        190
    );

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("Công ty nhân sự T", 10, 200);
    doc.text("Email: hr@congtynhansuT.com", 10, 210);
    doc.text("Số điện thoại: +84 987654321", 10, 220);
    doc.text("Địa chỉ: 124 XVNT , BThanh ,TPHCM", 10, 230);

    // Chữ ký
    doc.setFont("GreatVibes");
    doc.setFontSize(20);
    doc.text("Tuấn", 150, 260);

    doc.setFont("Roboto");
    doc.setFontSize(12);
    doc.text("Recruiter", 150, 270);


    fileName = `Thông tin cá nhân - ${application.name}.pdf`;
    // const __dirname = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([a-z]):/, '$1:'));
    const __dirname = path.resolve();
    const filePath = path.resolve(__dirname, 'public/pdf', fileName);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    // Lưu file PDF
    doc.save(filePath);
    return filePath;
};

const getApply = async (req, res) => {
    try {
        const applications = await Application.find();
        return res.status(200).json({ success: true, applications });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Có lỗi xảy ra khi lấy danh sách ứng viên." });
    }
};
const apply = async (req, res) => {
    try {
        const { name, email, phone, aspiration, languageCertificate, skillCertificate } = req.body;
        const newApplication = new Application({
            name,
            email,
            phone,
            aspiration,
            languageCertificate,
            skillCertificate,
            cv: req.files.cv ? req.files.cv[0].filename : "",
            languageProof: req.files.languageProof ? req.files.languageProof[0].filename : "",
            skillProof: req.files.skillProof ? req.files.skillProof[0].filename : ""
        });

        await newApplication.save();
        return res.status(200).json({ success: true, message: "Thông tin ứng tuyển đã được gửi thành công." });
    } catch (error) {
        console.error("Error applying:", error);
        return res.status(500).json({ success: false, error: "Có lỗi xảy ra khi gửi thông tin ứng tuyển." });
    }
};
const updateApplicationStatus = async (req, res) => {
    const { applicationId, status } = req.body; // status có thể là 'approved' hoặc 'rejected'

    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, error: "Đơn ứng tuyển không tồn tại." });
        }

        application.status = status; // Cập nhật trạng thái
        await application.save();

        // Tạo nội dung email
        const subject = `Thông báo kết quả ứng tuyển - Công ty nhân sự T - ${status === 'approved' ? 'Chúc mừng bạn đã trúng tuyển!' : 'Cảm ơn bạn đã ứng tuyển!'}`;
        const recipientName = application.name;
        let attachmentPath;
        // attachmentPath = createPDF(application);
        let text;
        if (status === 'approved') {
            attachmentPath = createPDF(application);
            text = `Kính gửi ${recipientName},\n\nChúng tôi rất vui mừng thông báo rằng sau khi xem xét kỹ lưỡng hồ sơ của bạn, bạn đã được chọn vào vòng tiếp theo của quy trình tuyển dụng tại Công ty nhân sự T. Chúng tôi ấn tượng với kỹ năng và kinh nghiệm của bạn và tin rằng bạn sẽ là một bổ sung tuyệt vời cho đội ngũ của chúng tôi.\n\nBước tiếp theo: Chúng tôi sẽ mời bạn tham gia một buổi phỏng vấn/tiếp xúc trực tiếp vào một ngày không xa. Vui lòng xác nhận sự có mặt của bạn và thông báo cho chúng tôi nếu bạn có yêu cầu đặc biệt nào.\n\nThông tin liên hệ:\nNếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email này hoặc qua số điện thoại: 0937183556.\n\nWebsite: http://localhost:5173/\nFB: https://www.facebook.com/hoangtuan.to.39\n\nChúng tôi mong chờ được gặp bạn trong buổi phỏng vấn và rất háo hức về cơ hội làm việc cùng bạn tại Công ty nhân sự T.\n\nChúc bạn một ngày tốt lành!\n\nTrân trọng,\nTuấn Hoàng\nCông ty nhân sự T\nRecruiter`;
        } else {
            text = `Kính gửi ${recipientName},\n\nChân thành cảm ơn bạn đã dành thời gian nộp hồ sơ ứng tuyển vào Công ty nhân sự T. Sau khi xem xét kỹ lưỡng tất cả các hồ sơ ứng tuyển, chúng tôi rất tiếc phải thông báo rằng bạn đã không được chọn vào vòng tiếp theo của quy trình tuyển dụng.\n\nMặc dù chúng tôi không thể tiến hành tiếp với hồ sơ của bạn trong lần này, nhưng chúng tôi đánh giá cao những kinh nghiệm và kỹ năng bạn đã chia sẻ trong hồ sơ của mình. Chúng tôi sẽ lưu giữ thông tin của bạn trong hệ thống và nếu có cơ hội phù hợp trong tương lai, chúng tôi sẽ liên hệ với bạn.\n\nCảm ơn bạn một lần nữa vì đã quan tâm và ứng tuyển vào Công ty nhân sự T. Chúng tôi chúc bạn sẽ tìm được cơ hội nghề nghiệp phù hợp và thành công trong những bước tiếp theo của sự nghiệp.\n\nThông tin liên hệ:\nWebsite: http://localhost:5173/\nFB: https://www.facebook.com/hoangtuan.to.39\n\nTrân trọng,\nTuấn Hoàng\nCông ty nhân sự T\nRecruiter`;
        }

        // Gửi email thông báo cho ứng viên
        await sendEmail(application.email, subject, text, attachmentPath);

        return res.status(200).json({ success: true, message: "Cập nhật trạng thái đơn ứng tuyển thành công." });
    } catch (error) {
        console.error("Error updating application status:", error);
        return res.status(500).json({ success: false, error: "Có lỗi xảy ra khi cập nhật trạng thái." });
    }
};

// Hàm xem chi tiết đơn ứng tuyển
const getApplicationDetails = async (req, res) => {
    const { applicationId } = req.params; // Lấy ID đơn ứng tuyển từ params
    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ success: false, error: "Đơn ứng tuyển không tồn tại." });
        }
        return res.status(200).json({ success: true, application });
    } catch (error) {
        console.error("Error fetching application details:", error);
        return res.status(500).json({ success: false, error: "Có lỗi xảy ra khi lấy thông tin đơn ứng tuyển." });
    }
};

export { apply, getApply, updateApplicationStatus, upload, getApplicationDetails };
