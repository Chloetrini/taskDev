const baseStyles = `
  body { margin: 0; padding: 0; background-color: #974FD0; font-family: Arial, sans-serif; }
  .wrapper { width: 100%; background-color: #974FD0; padding: 0; }
  .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 0 0 12px 12px; overflow: hidden; }
  .header { background-color: #974FD0; padding: 36px 24px 28px; text-align: center; }
  .header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.18); border-radius: 14px; margin: 0 auto 14px; text-align: center; line-height: 52px; font-size: 26px; display: block; }
  .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
  .header p { color: #e8d5f5; margin: 6px 0 0; font-size: 13px; }
  .badge { display: inline-block; background: rgba(255,255,255,0.15); color: #f5eaff; font-size: 11px; padding: 3px 10px; border-radius: 20px; margin-top: 10px; letter-spacing: 0.5px; text-transform: uppercase; }
  .body { padding: 32px 24px; background: #ffffff; }
  .body h2 { color: #6b2fa0; margin: 0 0 12px; font-size: 20px; font-weight: 700; }
  .body p { color: #444444; font-size: 14px; line-height: 1.7; margin: 0 0 16px; }
  .btn-wrap { text-align: center; padding: 8px 0 24px; }
  .btn { display: inline-block; background-color: #974FD0; color: #ffffff !important; text-decoration: none !important; padding: 14px 36px; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; }
  .note { color: #974FD0; font-size: 12px; line-height: 1.6; margin: 0 0 6px; }
  .link-box { margin-top: 16px; padding: 12px 14px; background: #f5eaff; border-radius: 8px; border: 1px solid #d9b3f0; }
  .link-box p { color: #974FD0; font-size: 11px; margin: 0 0 4px; font-weight: 700; }
  .link-box a { color: #6b2fa0; font-size: 11px; word-break: break-all; }
  .divider { height: 1px; background: #f5eaff; }
  .footer { background: #f5eaff; padding: 18px 24px; text-align: center; }
  .footer p { color: #974FD0; font-size: 11px; margin: 0; }
  @media only screen and (max-width: 600px) {
    .container { width: 100% !important; border-radius: 0 !important; }
    .body { padding: 24px 16px !important; }
    .header { padding: 24px 16px !important; }
    .btn { padding: 12px 24px !important; font-size: 14px !important; }
  }
`;

const emailWrapper = (content: string): string => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${baseStyles}</style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        ${content}
        <div class="divider"></div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TaskDev. All rights reserved.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
`;


// VERIFY EMAIL

export const verificationEmailTemplate = (
  name: string,
  verifyUrl: string
): { subject: string; html: string } => ({
  subject: "Verify your TaskDev email",
  html: emailWrapper(`
    <div class="header">
      <div class="header-icon">✅</div>
      <h1>TaskDev</h1>
      <p>Your productivity, organised</p>
      <span class="badge">Email verification</span>
    </div>
    <div class="body">
      <h2>Confirm your email</h2>
      <p>Hi <strong>${name}</strong>, welcome to TaskDev! One quick step — verify your email address to activate your account and start managing your tasks.</p>
      <div class="btn-wrap">
        <a href="${verifyUrl}" class="btn" target="_blank">Verify my email</a>
      </div>
      <p class="note">This link expires in <strong>24 hours</strong>.</p>
      <p class="note">Didn't create an account? You can safely ignore this email.</p>
      <div class="link-box">
        <p>Or copy this link</p>
        <a href="${verifyUrl}" target="_blank">${verifyUrl}</a>
      </div>
    </div>
  `),
});


// WELCOME EMAIL

export const welcomeEmailTemplate = (
  name: string
): { subject: string; html: string } => ({
  subject: "You're in — welcome to TaskDev!",
  html: emailWrapper(`
    <div class="header">
      <div class="header-icon">🚀</div>
      <h1>TaskDev</h1>
      <p>Your productivity, organised</p>
      <span class="badge">You're in!</span>
    </div>
    <div class="body">
      <h2>You're all set, ${name}!</h2>
      <p>Your email has been verified and your TaskDev account is ready. Start creating tasks, set deadlines, and stay on top of everything that matters.</p>
      <div class="btn-wrap">
        <a href="${process.env.CLIENT_URL}" class="btn" target="_blank">Go to my dashboard</a>
      </div>
      <p style="color:#888;font-size:13px;text-align:center;margin:0;">Glad to have you on board.</p>
    </div>
  `),
});


// PASSWORD RESET

export const passwordResetEmailTemplate = (
  name: string,
  resetUrl: string
): { subject: string; html: string } => ({
  subject: "Reset your TaskDev password",
  html: emailWrapper(`
    <div class="header">
      <div class="header-icon">🔓</div>
      <h1>TaskDev</h1>
      <p>Your productivity, organised</p>
      <span class="badge">Password reset</span>
    </div>
    <div class="body">
      <h2>Reset your password</h2>
      <p>Hi <strong>${name}</strong>, we received a request to reset your TaskDev password. Click below to create a new one.</p>
      <div class="btn-wrap">
        <a href="${resetUrl}" class="btn" target="_blank">Reset my password</a>
      </div>
      <p class="note">This link expires in <strong>1 hour</strong>.</p>
      <p class="note">Didn't request this? No action needed — your account is safe.</p>
      <div class="link-box">
        <p>Or copy this link</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      </div>
    </div>
  `),
});