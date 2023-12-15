const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require('path');
const { findUsersByEmail } = require('./userServices');

const notificationSet = {
  one: "has shared a video with you on dipoleVibe.",
  two: "has invited you to stream a video on dipoleVibe."
}

// Function to load and compile an email template
function compileTemplate(templatePath, dynamicContent) {
  const source = fs.readFileSync(templatePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const htmlToSend = template(dynamicContent);

  return {
    text: 'Hello world', // Default text content
    html: htmlToSend,
  };
}

// Function to create a mail configuration object
function createMailConfig({ senderName,from, to, subject, text, html }) {
  return {
    from: `"${senderName}" <${from}>`,
    to,
    subject,
    text,
    html,
  };
}

// Function to send email using the provided configuration
async function sendMail(transporter, mailConfig) {
  try {
    const result = await transporter.sendMail(mailConfig);
    return result;
  } catch (error) {
    throw error;
  }
}

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.email',
  secure: false,
  service: 'gmail',
  auth: {
    user: 'koladesalaudeen365@gmail.com',
    pass: 'iwphekpmgdegrjoi'
  }
});

// Template paths
const mailTemplatePath = path.join(__dirname, '../templates/reminder_mail.html');
const inviteTemplatePath = path.join(__dirname, '../templates/invite.html');

// Compile templates
const reminderTemplate = compileTemplate(mailTemplatePath, { username: 'dipoleVibe' });


// Create mail configuration objects
const reminderConfig = createMailConfig({
  senderName: 'dipoleVibe',
  from: 'mail@dipoleDIAMOND.com',
  subject: 'Reminder',
  ...reminderTemplate,
});

// Example of sending a reminder email
async function sendReminderMail(mailAddr) {
  try {
    reminderConfig.to = mailAddr;
    const result = await sendMail(transporter, reminderConfig);
    return result;
  } catch (error) {
    throw error;
  }
}

// Example of sending an invite email
async function sendInviteMail(author,mailAddr) {
    const recipientExist = await findUsersByEmail(mailAddr);
    let inviteTemplate;
    if (recipientExist != ""){
      inviteTemplate = compileTemplate(inviteTemplatePath,
         {senderEmail: author,
          recipientName: mailAddr,
          notification: notificationSet.one
        });
    }else{
      inviteTemplate = compileTemplate(inviteTemplatePath, 
        {senderEmail: author,
         recipientName: mailAddr,
         notification: notificationSet.two
        });
    }

    //const inviteTemplate = compileTemplate(inviteTemplatePath, {senderEmail: author, recipientName: mailAddr});

    const inviteConfig = createMailConfig({
      senderName: 'dipoleVibe',
      from: 'mail@dipoleDIAMOND.com',
      subject: 'Notification',
      ...inviteTemplate,
    });

    inviteConfig.to = mailAddr;
    return sendMail(transporter, inviteConfig);
}

module.exports = {
  sendReminderMail,
  sendInviteMail,
};
