import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    aspiration: { type: String, require: true },
    cv: { type: String, required: true }, // Đường dẫn đến file CV
    languageCertificate: { type: String, required: true }, // Chứng chỉ ngoại ngữ
    skillCertificate: { type: String, required: true }, // Chứng chỉ kỹ năng
    languageProof: { type: String, required: true },
    skillProof: { type: String, required: true }, // Đường dẫn đến hình ảnh minh chứng
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Trạng thái đơn ứng tuyển
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;