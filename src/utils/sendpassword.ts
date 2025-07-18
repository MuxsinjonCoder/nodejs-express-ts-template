import nodemailer from "nodemailer";

interface SendPasswordPropsTypes {
  to: string;
  subject: string;
  code: string | number;
}

const sendPassword = async ({ to, subject, code }: SendPasswordPropsTypes) => {
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
      <img src="https://cdn-icons-png.flaticon.com/512/2913/2913461.png" alt="Password" width="60" style="margin-bottom: 20px;" />
      <h2 style="color: #333;">Parolingiz</h2>
      <p style="font-size: 16px; color: #555; margin: 10px 0;">
        Quyida sizning parolingiz ko‘rsatilgan:
      </p>
      <div style="display: inline-block; padding: 12px 24px; background-color: #268ACA; color: #fff; font-size: 24px; letter-spacing: 2px; border-radius: 8px; font-weight: bold; margin-top: 15px;">
        ${code}
      </div>
      <p style="font-size: 14px; color: #999; margin-top: 20px;">
        Parolingizni hech kim bilan bo‘lishmang.
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

export default sendPassword;
