import 'dotenv/config';
import sgMail from '@sendgrid/mail';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';
import ws from 'ws';

// Configure Neon for serverless
neonConfig.webSocketConstructor = ws;

// Define email signups table schema inline for standalone function (matching actual DB)
const emailSignups = pgTable('email_signups', {
  id: serial('id').primaryKey(),
  email: varchar('email').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Standalone serverless function for email signup with database storage and SendGrid integration
export default async function handler(req, res) {
  // CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, firstName } = req.body || {};

    // Basic email validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: 'Valid email required' });
    }

    // Enhanced email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: 'Please enter a valid email address' });
    }

    // Additional security validations
    const sanitizedEmail = email.toLowerCase().trim();

    // Length validation to prevent buffer overflow
    if (sanitizedEmail.length > 255) {
      return res.status(400).json({ message: 'Email address too long' });
    }

    // Block potentially dangerous characters that could be used for injection
    const dangerousChars = [
      '<',
      '>',
      '"',
      "'",
      ';',
      '\\',
      '`',
      '|',
      '&',
      '$',
      '(',
      ')',
      '{',
      '}',
      '[',
      ']',
    ];
    for (const char of dangerousChars) {
      if (sanitizedEmail.includes(char)) {
        return res
          .status(400)
          .json({ message: 'Email contains invalid characters' });
      }
    }

    // Validate domain part length
    const [localPart, domainPart] = sanitizedEmail.split('@');
    if (localPart.length > 64 || domainPart.length > 255) {
      return res.status(400).json({ message: 'Email format invalid' });
    }

    // Validate and sanitize firstName if provided
    let sanitizedFirstName = null;
    if (firstName) {
      if (typeof firstName !== 'string') {
        return res.status(400).json({ message: 'First name must be text' });
      }

      sanitizedFirstName = firstName.trim();

      // Length validation
      if (sanitizedFirstName.length > 50) {
        return res.status(400).json({ message: 'First name too long' });
      }

      // Block potentially dangerous characters that could be used for injection
      const dangerousChars = [
        '<',
        '>',
        '"',
        "'",
        ';',
        '\\',
        '`',
        '|',
        '&',
        '$',
        '(',
        ')',
        '{',
        '}',
        '[',
        ']',
      ];
      for (const char of dangerousChars) {
        if (sanitizedFirstName.includes(char)) {
          return res
            .status(400)
            .json({ message: 'First name contains invalid characters' });
        }
      }
    }

    // Save email to database
    let emailSaved = false;
    if (process.env.DATABASE_URL) {
      try {
        console.log(`Attempting to save email: ${sanitizedEmail}`);
        const pool = new Pool({ connectionString: process.env.DATABASE_URL });
        const db = drizzle({ client: pool, schema: { emailSignups } });

        // Use sanitized email for database operation
        const result = await db
          .insert(emailSignups)
          .values({
            email: sanitizedEmail,
          })
          .onConflictDoUpdate({
            target: emailSignups.email,
            set: {
              createdAt: new Date(),
            },
          })
          .returning();

        emailSaved = true;
        console.log(`Email successfully saved to database:`, result);

        // Close the connection
        await pool.end();
      } catch (dbError) {
        console.error(`Database save failed for ${sanitizedEmail}:`, dbError);
        console.error('Stack trace:', dbError.stack);
        // Don't fail the request if database fails
      }
    } else {
      console.log('DATABASE_URL not configured, skipping database save');
    }

    // Log email signup for collection backup (using sanitized values)
    console.log(
      'EMAIL_SIGNUP:',
      JSON.stringify({
        email: sanitizedEmail,
        firstName: sanitizedFirstName,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'] || 'unknown',
        savedToDatabase: emailSaved,
      })
    );

    // Send confirmation email via SendGrid
    let emailSent = false;
    if (process.env.SENDGRID_API_KEY) {
      try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
          to: sanitizedEmail,
          from: {
            email: 'hello@getcork.app',
            name: 'cork',
          },
          subject: "You're on the list! cork is launching soon 🍷",
          text: `G'day${sanitizedFirstName ? ` ${sanitizedFirstName}` : ''}!

Thanks for signing up to be notified when cork launches!

We're putting the finishing touches on Australia's smartest wine recommendation platform. You'll be among the first to know when we go live.

What to expect:
• AI-powered wine recommendations tailored to your taste
• Expert analysis of Australian wines
• Personalised food pairing suggestions
• Smart cellar management tools

We'll only email you when cork is ready to launch - no spam, ever.

Cheers!
The cork team

--
cork - Australia's smartest wine recommendations
getcork.app`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #7c2d12;">G'day${
                sanitizedFirstName ? ` ${sanitizedFirstName}` : ''
              }!</h2>
              
              <p>Thanks for signing up to be notified when <strong>cork</strong> launches!</p>
              
              <p>We're putting the finishing touches on Australia's smartest wine recommendation platform. You'll be among the first to know when we go live.</p>
              
              <h3 style="color: #7c2d12;">What to expect:</h3>
              <ul>
                <li>AI-powered wine recommendations tailored to your taste</li>
                <li>Expert analysis of Australian wines</li>
                <li>Personalised food pairing suggestions</li>
                <li>Smart cellar management tools</li>
                <li>Australian wine region knowledge</li>
              </ul>
              
              <p style="color: #666;">We'll only email you when cork is ready to launch - no spam, ever.</p>
              
              <p><strong>Cheers!</strong><br>The cork team</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">
                cork - Australia's smartest wine recommendations<br>
                <a href="https://getcork.app" style="color: #7c2d12;">getcork.app</a>
              </p>
            </div>
          `,
        };

        await sgMail.send(msg);
        emailSent = true;
        console.log(`Confirmation email sent to: ${sanitizedEmail}`);
      } catch (emailError) {
        console.error(
          `Email send failed for ${sanitizedEmail}:`,
          emailError.message
        );
        // Don't fail the request if email fails
      }
    } else {
      console.log('SendGrid not configured, skipping email');
    }

    return res.json({
      message:
        "Thank you for signing up! You'll be notified when cork launches.",
      success: true,
      emailSent,
      emailSaved,
    });
  } catch (error) {
    console.error('Email signup error:', error);
    return res.status(500).json({ message: 'Please try again' });
  }
}
