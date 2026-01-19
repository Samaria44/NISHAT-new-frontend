# Email Configuration Setup

## Gmail Configuration for Order Confirmation Emails

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Enable 2-Factor Authentication (2FA)

### Step 2: Create App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" for the app
3. Select "Other (Custom name)" and name it "ZAVARO Backend"
4. Copy the generated 16-character password

### Step 3: Configure Environment Variables
Create a `.env` file in the backend root directory:

```env
# Email Configuration
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASS=your-16-character-app-password

# Other configurations
MONGODB_URI=mongodb://localhost:27017/zavaro
JWT_SECRET=your-jwt-secret-key
PORT=5000
NODE_ENV=development
```

### Step 4: Test the Configuration
1. Restart the backend server
2. Place a test order
3. Check the console logs for email status
4. Verify email receipt

## Troubleshooting

### Common Issues:
1. **"Invalid login"**: Use App Password, not regular password
2. **"Less secure apps"**: Enable App Passwords instead
3. **No email sent**: Check environment variables are loaded
4. **Email goes to spam**: Mark as safe sender

### Email Flow:
1. Order placed → Saved to database
2. Email credentials validated
3. Customer email verified
4. Product details populated
5. HTML email generated
6. Email sent via Gmail SMTP
7. Success/failure logged

## Security Notes:
- Never commit `.env` file to version control
- Use App Passwords, not regular passwords
- Consider using email service like SendGrid for production
