import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import fsExtra from 'fs-extra';

// Ensure cover letter directory exists
const coverLetterDir = './uploads/cover-letters';
fsExtra.ensureDirSync(coverLetterDir);

/**
 * Generate a PDF cover letter and save it to disk
 * @param {string} content - The cover letter text content
 * @param {string} jobTitle - The job title
 * @param {string} applicantName - The applicant's name
 * @returns {Promise<string>} - The path to the generated PDF file
 */
export const generateCoverLetterPDF = (content, jobTitle, applicantName) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const sanitizedJobTitle = jobTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      const filename = `cover-letter-${sanitizedJobTitle}-${uniqueSuffix}.pdf`;
      const outputPath = path.join(coverLetterDir, filename);
      
      // Create a PDF document
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4'
      });
      
      // Pipe the PDF to a write stream
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);
      
      // Add the header
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text('COVER LETTER', { align: 'center' })
         .moveDown(0.5);
      
      doc.font('Helvetica-Bold')
         .fontSize(14)
         .text(`${jobTitle}`, { align: 'center' })
         .moveDown(0.5);
         
      // Add content
      doc.font('Helvetica')
         .fontSize(12)
         .text(content, {
           align: 'left',
           lineGap: 5
         });
      
      // Finalize the PDF
      doc.end();
      
      // Handle stream completion
      stream.on('finish', () => {
        resolve(outputPath);
      });
      
      // Handle stream errors
      stream.on('error', (err) => {
        reject(err);
      });
      
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  generateCoverLetterPDF
}; 