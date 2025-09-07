// functions/index.js

const {onCall} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
require("dotenv").config(); // .env fájl betöltése
admin.initializeApp();

const gmailEmail = process.env.MAIL_USER;
const gmailPassword = process.env.MAIL_PASS;

const createTransporter = () => {
  if (!gmailEmail || !gmailPassword) {
    console.error("Missing MAIL_USER or MAIL_PASS in environment");
    throw new Error("Email service configuration missing.");
  }
  return nodemailer.createTransport({
    service: "gmail",
    auth: {user: gmailEmail, pass: gmailPassword},
  });
};

// ----------------------------------------------------------------------
// 1. sendEmail (HTTPS Callable)
// ----------------------------------------------------------------------
exports.sendEmail = onCall({region: "europe-west3"}, async (request) => {
  const {name, email, subject, message} = request.data;

  let transporter;
  try {
    transporter = createTransporter();
  } catch (e) {
    console.error("Failed to create transporter in sendEmail:", e);
    throw new Error("Email service init failed.");
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: "eskuvozes@gmail.com",
    subject,
    html: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via onCall!");
    return {success: true, message: "Üzenet sikeresen elküldve!"};
  } catch (error) {
    console.error("Error sending email via onCall:", error);
    throw new Error("Üzenet küldése sikertelen.");
  }
});

// ----------------------------------------------------------------------
// 2. sendEmailOnNewMessage (Firestore Trigger)
// ----------------------------------------------------------------------
exports.sendEmailOnNewMessage = onDocumentCreated(
    {
      document: "messages/{messageId}",
      region: "europe-west3",
    },
    async (event) => {
      const newMessage = event.data.data();
      const messageId = event.params.messageId;

      console.log(`New message created with ID: ${messageId}`, newMessage);

      let transporter;
      try {
        transporter = createTransporter();
      } catch (e) {
        console.error("Failed to create transporter in sendEmailOnNewMessage:", e);
        return null;
      }

      const mailSubject = `Új üzenet a weboldalról (ID: ${messageId})`;
      const mailBody = `
      <p><strong>Új üzenet érkezett a weboldalon keresztül:</strong></p>
      <ul>
      <li><strong>Tárgy:</strong> ${newMessage.subject || "Nincs megadva"}</li>
        <li><strong>Név:</strong> ${newMessage.name || "Nincs megadva"}</li>
        <li><strong>Email:</strong> ${newMessage.email || "Nincs megadva"}</li>
        <li><strong>Üzenet:</strong><br>${newMessage.message || "Nincs üzenet"}</li>
      </ul>
      <hr>
      <p>Az üzenet a "${messageId}" ID-val lett elmentve az adatbázisban.</p>
    `;

      const mailOptions = {
        from: `"Weboldal Üzenet" <${gmailEmail}>`,
        to: "work@norbertgillich.com",
        subject: mailSubject,
        html: mailBody,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully for new Firestore message!");
        return null;
      } catch (error) {
        console.error("Error sending email for new Firestore message:", error);
        return null;
      }
    },
);
