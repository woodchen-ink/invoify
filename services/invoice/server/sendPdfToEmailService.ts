import { NextRequest } from "next/server";

// Nodemailer
import nodemailer, { SendMailOptions } from "nodemailer";

// React-email
import { render } from "@react-email/render";

// Components
import { SendPdfEmail } from "@/app/components";

// Helpers
import { fileToBuffer } from "@/lib/helpers";

// Variables
import { NODEMAILER_EMAIL, NODEMAILER_PW, NODEMAILER_HOST } from "@/lib/variables";

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: NODEMAILER_HOST,
    port: 465,
    secure: true,
    auth: {
        user: NODEMAILER_EMAIL,
        pass: NODEMAILER_PW,
    },
});

/**
 * Send a PDF as an email attachment.
 *
 * @param {NextRequest} req - The Next.js request object.
 * @returns {Promise<boolean>} A Promise that resolves to a boolean, indicating whether the email was sent successfully.
 * @throws {Error} Throws an error if there is an issue with sending the email.
 */
export async function sendPdfToEmailService(
    req: NextRequest
): Promise<boolean> {
    const fd = await req.formData();

    // Get form data values
    const email = fd.get("email") as string;
    const invoicePdf = fd.get("invoicePdf") as File;
    const invoiceNumber = fd.get("invoiceNumber") as string;

    // Get email html content
    const emailHTML = render(SendPdfEmail({ invoiceNumber }));

    // Convert file to buffer
    const invoiceBuffer = await fileToBuffer(invoicePdf);

    try {
        const mailOptions: SendMailOptions = {
            from: `CZL Express <${NODEMAILER_EMAIL}>`,
            to: email,
            subject: `发票已生成: #${invoiceNumber}`,
            html: emailHTML,
            attachments: [
                {
                    filename: "发票.pdf",
                    content: invoiceBuffer,
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Error sending email", error);
        return false;
    }
}
