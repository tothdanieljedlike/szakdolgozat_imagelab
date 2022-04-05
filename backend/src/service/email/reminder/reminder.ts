import {readFileSync} from 'fs';
import {join} from 'path';
import {publicDir} from '../../../util/fs/fs';
import {sendEmail} from '../email';

const reminderBody = readFileSync(join(__dirname, 'reminder.html'), 'utf8');
const passwordBody = readFileSync(join(__dirname, 'reset.html'), 'utf8');

export async function sendReminder(address: string, hash: string) {
    await sendEmail({
        from: process.env.SMTP_EMAIL,
        to: address,
        subject: 'New password - UniPannon',
        text: 'Plaintext version of the message',
        html: getReminderHTMLBody(hash),
        attachments: [{
            filename: 'image.png',
            path: join(publicDir, 'assets', 'logo_en.png'),
            cid: 'logo_en.png',
        }],
    });
    return hash;
}

function getReminderHTMLBody(hash: string) {
    return reminderBody.replace(
        '{{LINK}}',
        `https://${process.env.HOST}:${process.env.PORT}/api/user/reminder/verify/?token=${hash}`);
}

export async function sendResetedPassword(address: string, hash: string) {
    await sendEmail({
        from: process.env.SMTP_EMAIL,
        to: address,
        subject: 'New password - UniPannon',
        text: 'Plaintext version of the message',
        html: getResetHTMLBody(hash),
        attachments: [{
            filename: 'image.png',
            path: join(publicDir, 'assets', 'logo_en.png'),
            cid: 'logo_en.png',
        }],
    });
    return hash;
}

function getResetHTMLBody(hash: string) {
    return passwordBody.replace('{{PASSWORD}}', hash);
}
