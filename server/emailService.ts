import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY not found - email features will be disabled');
} else {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailSignupConfirmationData {
  email: string;
  firstName?: string;
}

export async function sendEmailSignupConfirmation({ email, firstName }: EmailSignupConfirmationData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('SendGrid not configured, skipping email');
    return false;
  }

  try {
    const msg = {
      to: email,
      from: {
        email: 'hello@cork.wine', // You'll need to verify this domain in SendGrid
        name: 'cork'
      },
      subject: "You're on the list! cork is launching soon 🍷",
      text: `G'day${firstName ? ` ${firstName}` : ''}!

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
This email was sent because you signed up for launch notifications at cork.wine
If you didn't sign up, please ignore this email.`,
      html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to cork</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #8B5A5A 0%, #6B4E71 100%); color: white; padding: 40px 30px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .header-text { font-size: 18px; opacity: 0.9; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; }
        .features { background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0; }
        .feature-item { display: flex; align-items: flex-start; margin-bottom: 15px; }
        .feature-icon { color: #8B5A5A; margin-right: 10px; font-size: 16px; }
        .cta-section { text-align: center; margin: 30px 0; }
        .footer { background-color: #f8f9fa; padding: 25px 30px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #e9ecef; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">cork</div>
            <div class="header-text">Australia's smartest wine recommendation platform</div>
        </div>
        
        <div class="content">
            <div class="greeting">G'day${firstName ? ` ${firstName}` : ''}!</div>
            
            <p>Thanks for signing up to be notified when <strong>cork</strong> launches!</p>
            
            <p>We're putting the finishing touches on Australia's smartest wine recommendation platform. You'll be among the first to know when we go live.</p>
            
            <div class="features">
                <h3 style="margin-top: 0; color: #8B5A5A;">What to expect:</h3>
                <div class="feature-item">
                    <span class="feature-icon">🤖</span>
                    <span>AI-powered wine recommendations tailored to your taste</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🍷</span>
                    <span>Expert analysis of Australian wines</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">🍽️</span>
                    <span>Personalised food pairing suggestions</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">📊</span>
                    <span>Smart cellar management tools</span>
                </div>
            </div>
            
            <p>We'll only email you when cork is ready to launch - no spam, ever.</p>
            
            <p style="margin-top: 30px;">Cheers!<br><strong>The cork team</strong></p>
        </div>
        
        <div class="footer">
            This email was sent because you signed up for launch notifications at cork.wine<br>
            If you didn't sign up, please ignore this email.
        </div>
    </div>
</body>
</html>`
    };

    await sgMail.send(msg);
    console.log(`Confirmation email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}