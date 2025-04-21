import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  /**
   * Load and compile Handlebars template
   */
  private compileTemplate(templateName: string, context: any): string {
    const templatePath = path.join(
      __dirname,
      '..',
      'templates',
      `${templateName}.hbs`,
    );
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    return template(context);
  }

  /**
   * Send email with dynamic content
   */
  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ): Promise<void> {
    const html = this.compileTemplate(templateName, context);

    await this.transporter.sendMail({
      from: `"Support Team" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  }
}
