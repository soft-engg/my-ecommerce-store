import NodeMailer from 'nodemailer';
import validate from 'deep-email-validator';
export default async function handler(req, res) {
  const { valid } = await validate(req.query.email);
  if (!valid) {
    res.send('notValidEmail');
    return;
  }
  return new Promise((resolve, reject) => {
    var transporter = NodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pshahbaz99@gmail.com',
        pass: 'pnrmniihbjcohxsh',
      },
    });
    const code = Math.floor(1000 + Math.random() * 9000);
    var mailOptions = {
      from: 'pshahbaz99@gmail.com',
      to: req.query.email,
      subject: 'Your OTP for Ecommerce Store',
      html:
        '<html><body><h4 style="color:rgb(8, 224, 224 )">Use this OTP to create account on Ecommerce Store</h4> <h3 style="color:rgb(255, 195, 0)">' +
        code.toString() +
        '</h3><p> <b>Note:</b> If this is not you then ignore this email.</p></html></body>',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        reject('error');
      } else {
        console.log('Email sent: ' + info.response);
        resolve(res.send(code));
      }
    });
  });
}
