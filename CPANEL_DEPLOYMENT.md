# LeadHive AI — cPanel Deployment & Configuration Guide

This step-by-step guide walks you through configuring API keys, building the static React frontend, and deploying both the frontend and PHP backend to standard cPanel hosting.

---

## Overview of Files & Secrets

| Key / Secret | Where It Goes | Is It Public? |
|---|---|---|
| **Google reCAPTCHA v2 Site Key** | `.env` file (Frontend) | Public (bundled in React) |
| **Google reCAPTCHA v2 Secret Key** | `leadhive-config.php` (Server) | **Private** (Outside `public_html`) |
| **Resend API Key** | `leadhive-config.php` (Server) | **Private** (Outside `public_html`) |
| **Receiving Inbox Email** | `leadhive-config.php` (Server) | **Private** (Outside `public_html`) |

---

## Step 1: Configure Frontend (.env)

Open the `.env` file in the root of your project:

```env
VITE_RECAPTCHA_SITE_KEY=PASTE_RECAPTCHA_SITE_KEY_HERE
```

Replace `PASTE_RECAPTCHA_SITE_KEY_HERE` with your Google reCAPTCHA v2 **Site Key** (Checkbox type).

> **Important**: Never place your Resend API key or reCAPTCHA secret key in `.env`.

---

## Step 2: Build the Production Bundle

In your local terminal / command prompt, run:

```bash
npm run build
```

This generates a production-ready `dist/` directory containing:
- `dist/index.html`
- `dist/assets/`
- `dist/api/contact.php`
- `dist/.htaccess`
- `dist/LeadHive AI Logo.png`

---

## Step 3: Create Server Configuration File (`leadhive-config.php`)

Create a file named `leadhive-config.php` with the following content:

```php
<?php

return [
    'resend_api_key' => 'PASTE_RESEND_API_KEY_HERE',
    'recaptcha_secret_key' => 'PASTE_RECAPTCHA_SECRET_KEY_HERE',
    'from_email' => 'LeadHive AI <hello@leadhive-ai.com>',
    'to_email' => 'PASTE_RECEIVING_EMAIL_HERE',
];
```

Fill in your 4 values:
1. `PASTE_RESEND_API_KEY_HERE` → Your Resend API Key (starts with `re_...`).
2. `PASTE_RECAPTCHA_SECRET_KEY_HERE` → Your Google reCAPTCHA v2 Secret Key.
3. `LeadHive AI <hello@leadhive-ai.com>` → Verified sender address in your Resend account.
4. `PASTE_RECEIVING_EMAIL_HERE` → Email address where you want to receive lead submissions.

---

## Step 4: Upload to cPanel

### 1. Upload `leadhive-config.php` (Outside `public_html`)
In cPanel File Manager:
- Navigate to your home directory: `/home/CPANEL_USERNAME/`
- Upload `leadhive-config.php` directly into `/home/CPANEL_USERNAME/` (one level above `public_html`).
- *This prevents any web visitor from ever downloading your API keys.*

### 2. Upload Website Files (Inside `public_html`)
- Open `/home/CPANEL_USERNAME/public_html/`
- Upload all contents from your local `dist/` directory into `public_html/`:
  - `index.html`
  - `assets/`
  - `api/contact.php`
  - `.htaccess`
  - `LeadHive AI Logo.png`

---

## Step 5: Verify the Deployment

1. Visit your domain: `https://yourdomain.com/`
2. Scroll to the **Book a Demo** section.
3. Verify that the Google reCAPTCHA checkbox displays.
4. Try submitting the form without ticking the reCAPTCHA (it should block submission with a notice).
5. Tick the reCAPTCHA and submit test details.
6. Verify:
   - Success message is displayed: *"Thank you. Your request has been received. Our team will contact you shortly."*
   - The form and CAPTCHA reset.
   - You receive the HTML lead notification in your receiving inbox.
7. Test SPA routing by refreshing on `/contact`, `/privacy`, and `/terms`.
