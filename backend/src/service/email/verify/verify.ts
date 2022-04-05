import {readFileSync} from 'fs';
import {join} from 'path';
import {publicDir} from '../../../util/fs/fs';
import {sendEmail} from '../email';

const originalBody = readFileSync(join(__dirname, 'confirm.html'), 'utf8');

export async function sendVerifyEmail(address: string, hash: string) {
    await sendEmail({
        from: process.env.SMTP_EMAIL,
        to: address,
        subject: 'Confirmation - UniPannon',
        text: 'Plaintext version of the message',
        html: getHTMLBody(hash),
        attachments: [{
            filename: 'image.png',
            path: join(publicDir, 'assets', 'logo_en.png'),
            cid: 'logo_en.png',
        }],
    });
    return hash;
}

function getHTMLBody(hash: string) {
    const body = originalBody;
    return body.replace(
        '{{LINK}}',
        `https://${process.env.HOST}:${process.env.PORT}/api/user/validate/?token=${hash}`);
}
