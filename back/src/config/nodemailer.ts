import nodemailer from "nodemailer";

const config = () => {
    return {
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "94d58ae1c14382",
            pass: "2e91ac4f9b4b28",
        },
    };
};

export const transport = nodemailer.createTransport(config());