import TransportStream from 'winston-transport';
import nodemailer from 'nodemailer';

const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5분
const lastSentMap = new Map<string, number>();

export class MailTransport extends TransportStream {
    private transporter: nodemailer.Transporter;

    constructor() {
        super({ level: 'error' });
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    log(info: any, callback: () => void): void {
        setImmediate(() => this.emit('logged', info));

        if (info.level !== 'error') {
            callback();
            return;
        }

        const errorMessage = info.error?.message ?? info.message ?? 'unknown error';
        const endpoint = info.endpoint ?? 'unknown';
        const dedupKey = `${endpoint}:${errorMessage}`;
        const now = Date.now();
        const lastSent = lastSentMap.get(dedupKey) ?? 0;

        if (now - lastSent < DEDUP_WINDOW_MS) {
            callback();
            return;
        }

        lastSentMap.set(dedupKey, now);

        const method = info.method ?? '';
        const subject = `[TAROT ERROR] ${method} ${endpoint} - ${errorMessage}`;
        const body = `
<pre>
timestamp : ${info.timestamp ?? new Date().toISOString()}
requestId : ${info.requestId ?? '-'}
method    : ${method}
endpoint  : ${endpoint}
ip        : ${info.ip ?? '-'}
userId    : ${info.userId ?? null}

error     : ${errorMessage}
stack     :
${info.error?.stack ?? '-'}
</pre>
        `.trim();

        this.transporter
            .sendMail({
                from: process.env.MAIL_USER,
                to: process.env.MAIL_TO,
                subject,
                html: body,
            })
            .catch((err) => {
                // 메일 발송 실패는 콘솔에만 출력 (logger 재호출 시 무한루프 방지)
                console.error('[MailTransport] failed to send email:', err);
            });

        callback();
    }
}
