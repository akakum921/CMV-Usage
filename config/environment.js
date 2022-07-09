const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});



const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'akangry5',
            pass: 'kumarck@1234'
        }
    },
    google_client_id: "256730681801-oman6jvd5lo1i1t4qlsjq1r01riroph2.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8004/users/auth/google/callback",
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    },
    tls: {
        rejectUnauthorized: false
    }
}


const production =  {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    },
    tls: {
        rejectUnauthorized: false
    }
}
 

// module.exports = development;
module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);