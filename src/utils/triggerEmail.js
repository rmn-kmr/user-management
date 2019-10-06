/* eslint-disable no-buffer-constructor */
/* eslint-disable-next-line arrow-body-style */
/* eslint-disable-next-line arrow-body-style */
const sgMail = require('@sendgrid/mail');
const inlineCss = require('inline-css');
const handlebars = require('handlebars');
const fs = require('fs'); 
const SG_TOKEN = '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';
const forgotPasswordDir = `${__dirname}/emailTemplate/forgotPassword`;

const compileOpt = {
  userName: '',
  verifyLink: '',
  dirPath:''
};

sgMail.setApiKey(SG_TOKEN);

const options = {
  url: ' ',
  applyLinkTags: true,
};

const getCompileCreds = (obj) => {
  if (!obj.emailType) throw new Error('Email type not specified!!');
  const { firstName, lastName, to: email} = obj;
  switch (obj.emailType) {
    case 'forgotPassword':
      compileOpt.userName = `${firstName} ${lastName}`;
      compileOpt.dirPath = forgotPasswordDir;
      compileOpt.verifyLink = `${'localhost:3000/'}verifyAccount?verifyToken=${new Buffer(email).toString('base64')}`;
      break;
   
    default:
      return compileOpt;
  }
  return compileOpt;
};

const readFile = async (path) => {
  return new Promise(async (resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

const getTemplate = async (obj) => {
  getCompileCreds(obj);
  const html = await readFile(`${compileOpt.dirPath}/index.html`);
  const template = handlebars.compile(html);
  const result = template(compileOpt);
  return inlineCss(result, options);
};

const sendEmail = async ({
  to,
  title,
  body,
  emailType,
  firstName,
  lastName,
}) => {
  console.log('----------', to,
  title,
  body,
  emailType,
  firstName,
  lastName,);
  
  try {    
    const msg = {
      to,
      from: 'edgeplayer@edgeplayer.io',
      subject: title,
      html: body || await getTemplate({
        to,
        emailType,
        firstName,
        lastName,
      }),
    };
    
    sgMail.send(msg).then((err,sendEmailResponse ) => {
      console.log('sendEmailResponse---',sendEmailResponse);
      
       return sendEmailResponse;
    }); 
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  sendEmail,
};
