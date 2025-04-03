const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false,
    auth: {
        user: "61b05d2f84144b",
        pass: "c23d7638b24ae6",
    },
});

module.exports = {
    sendmailFrogetPass: async function (to, URL) {
        return await transporter.sendMail({
            from: `NNPTUD@heeheheh`, // sender address
            to: to, // list of receivers
            subject: "MAIL MỜI DU LỊCH CẢM", // Subject line
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f7f6;
                                padding: 20px;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            }
                            .header {
                                text-align: center;
                                color: #4CAF50;
                                font-size: 24px;
                                margin-bottom: 20px;
                            }
                            .content {
                                font-size: 16px;
                                line-height: 1.5;
                                color: #555;
                                text-align: center;
                            }
                            .button {
                                background-color: #4CAF50;
                                color: white;
                                padding: 10px 20px;
                                text-decoration: none;
                                border-radius: 5px;
                                display: inline-block;
                                margin-top: 20px;
                            }
                            .footer {
                                text-align: center;
                                margin-top: 30px;
                                font-size: 12px;
                                color: #aaa;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Chào bạn!</h1>
                            </div>
                            <div class="content">
                                <p>Chúng tôi rất vui mừng thông báo về một chương trình du lịch đặc biệt dành cho bạn. Hãy nhấn vào nút dưới đây để tìm hiểu thêm chi tiết và tham gia chuyến đi tuyệt vời này.</p>
                                <a href="${URL}" class="button">CLICK VÀO ĐÂY ĐỂ XEM VỚI CÁO</a>
                            </div>
                            <div class="footer">
                                <p>Đây là thư tự động, vui lòng không trả lời thư này.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `, // html body
        });
    }
};
