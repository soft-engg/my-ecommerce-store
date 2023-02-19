import NodeMailer from 'nodemailer';
import validate from ' body.email-validator';
import { getError } from '../../../utils/getError';
export default async function handler(req, res) {
  const { valid } = await validate(req.body.email);
  if (!valid) {
    res.send('notValidEmail');
    return;
  }
  var transporter = NodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pshahbaz99@gmail.com',
      pass: 'pnrmniihbjcohxsh',
    },
  });
  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log('Server is ready to take our messages');
        resolve(success);
      }
    });
  });

  const code = Math.floor(1000 + Math.random() * 9000);
  // setting of email to send
  var mailOptions = {
    from: 'pshahbaz99@gmail.com',
    to: req.body.email,
    subject: 'Your OTP for Ecommerce Store',
    html:
      '<html><body><h4 style="color:rgb(8, 224, 224 )">Use this OTP to create account on Ecommerce Store</h4> <h3 style="color:rgb(255, 195, 0)">' +
      code.toString() +
      '</h3><p> <b>Note:</b> If this is not you then body.email.</p></html></body>',
  };

  async function sendmail() {}
  {
    try {
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(getError(error));
          res.status(422).send('Unable to send Email', error);
        } else {
          console.log('Email sent: ' + info.response);
          res.send(200).send('sent successfully');
        }
      });
    } catch (error) {
      res.status(400).send(getError(error));
    }
  }
  await sendmail();
}
