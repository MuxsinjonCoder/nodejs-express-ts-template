import nodemailer from "nodemailer";

interface sendEmailPropsTypes {
  to: string;
  subject: string;
  code: string | number;
}

const sendEmail = async ({ to, subject, code }: sendEmailPropsTypes) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
     user: "muxsincoder@gmail.com", // email here
      pass: "---- ---- ---- ----", // email pass
    },
  });

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
      <div style="text-align: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Verification" width="60" style="margin-bottom: 20px;" />
        <h2 style="color: #333;">Tasdiqlash Kodingiz</h2>
        <p style="font-size: 16px; color: #555; margin: 10px 0;">
          Quyidagi 6 xonali tasdiqlash kodini kiriting:
        </p>
        <div style="display: inline-block; padding: 12px 24px; background-color: #268ACA; color: #fff; font-size: 24px; letter-spacing: 4px; border-radius: 8px; font-weight: bold; margin-top: 15px;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #999; margin-top: 20px;">
          Ushbu kod 3 daqiqa davomida amal qiladi.
        </p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: "muxsincoder@gmail.com",
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
