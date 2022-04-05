import helmet from 'helmet';

const base = helmet({
    contentSecurityPolicy: { // TODO: fix when angular fixed
        directives: {
            defaultSrc: ['\'self\''],
            styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
            fontSrc: ['\'self\'', 'https://fonts.gstatic.com'],
            imgSrc: ['\'self\'', 'data:', 'https://*.gstatic.com', 'https://maps.googleapis.com'],
            scriptSrc: ['\'self\'', 'https://*.google.com', 'https://*.gstatic.com', 'https://maps.googleapis.com'],
            frameSrc: ['\'self\'', 'https://*.google.com'],
        },
    }});

const referer = helmet.referrerPolicy({ policy: 'same-origin' });

export {
    base,
    referer,
};
