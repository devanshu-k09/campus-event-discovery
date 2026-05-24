import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

interface TicketData {
    userName: string;
    eventName: string;
    ticketId: string;
    date: string;
    time: string;
    location: string;
}

/**
 * Generates a professional PDF ticket with a QR code using PDFKit.
 * Features a premium indigo design with embedded validation.
 */
export async function generateTicketPDF(data: TicketData): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const chunks: Buffer[] = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Indigo Header Banner
            doc.rect(0, 0, doc.page.width, 100).fill('#4F46E5');
            doc.fillColor('#FFFFFF').fontSize(28).font('Helvetica-Bold')
               .text('🎟 CAMPUS EVENT TICKET', 50, 35, { align: 'center' });

            // Generate QR Code encoding: "TICKET-{ticketId}"
            const qrDataURL = await QRCode.toDataURL(`TICKET-${data.ticketId}`, { 
                width: 120,
                margin: 1,
                color: {
                    dark: '#1F2937',
                    light: '#FFFFFF'
                }
            });
            const qrBase64 = qrDataURL.replace('data:image/png;base64,', '');
            
            // Place QR Code in top right content area
            doc.image(Buffer.from(qrBase64, 'base64'), doc.page.width - 170, 115, { width: 120 });

            // Ticket Content Styling
            doc.fillColor('#1F2937').fontSize(13).font('Helvetica').moveDown(2.5);
            
            const field = (label: string, value: string) => {
                doc.font('Helvetica-Bold').fillColor('#4F46E5').text(label, { continued: true });
                doc.font('Helvetica').fillColor('#1F2937').text(`  ${value}`);
                doc.moveDown(0.6);
            };

            // Main Ticket Fields
            field('Event:', data.eventName);
            field('Attendee:', data.userName);
            field('Ticket ID:', data.ticketId.toUpperCase());
            field('Date:', data.date);
            field('Time:', data.time);
            field('Location:', data.location);

            // Visual Divider
            doc.moveDown(1.5).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y)
               .strokeColor('#E5E7EB').lineWidth(1).stroke();

            // Legal/Instruction Text
            doc.moveDown(1.5).fillColor('#6B7280').fontSize(10).font('Helvetica')
               .text('This ticket is valid for one-time entry only. Please present this digital pass or a printed copy at the entrance. The organizer reserves the right to verify identity.', {
                   align: 'left',
                   width: doc.page.width - 250
               });

            // Footer Branding
            doc.moveTo(0, doc.page.height - 80).lineTo(doc.page.width, doc.page.height - 80).strokeColor('#F3F4F6').stroke();
            doc.moveDown(2).fontSize(10).fillColor('#9CA3AF')
               .text('Powered by Campus Event Platform · Keep this ticket safe', { align: 'center' });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
}
