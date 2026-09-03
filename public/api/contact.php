<?php

declare(strict_types=1);

// Set strict security and JSON headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');

function respond(int $statusCode, array $payload): never
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function clean_string(mixed $value, int $maxLength, bool $stripNewlines = true): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = trim($value);

    if ($stripNewlines) {
        $value = str_replace(["\r", "\n", "\t"], ' ', $value);
    }

    // Strip unprintable control characters
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }

    return substr($value, 0, $maxLength);
}

function html_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function post_curl_json(string $url, array $headers, array $payload): array
{
    $body = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($body === false) {
        return ['ok' => false, 'status' => 0, 'body' => null];
    }

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);

        $raw = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);

        return [
            'ok' => $raw !== false && $status >= 200 && $status < 300,
            'status' => $status,
            'body' => is_string($raw) ? json_decode($raw, true) : null,
        ];
    }

    // Fallback if cURL is unavailable
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers),
            'content' => $body,
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ]);

    $raw = @file_get_contents($url, false, $context);
    $status = 0;
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $status = (int) $matches[1];
    }

    return [
        'ok' => $raw !== false && $status >= 200 && $status < 300,
        'status' => $status,
        'body' => is_string($raw) ? json_decode($raw, true) : null,
    ];
}

function post_curl_form(string $url, array $payload): array
{
    $body = http_build_query($payload);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2,
        ]);

        $raw = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);

        return [
            'ok' => $raw !== false && $status >= 200 && $status < 300,
            'status' => $status,
            'body' => is_string($raw) ? json_decode($raw, true) : null,
        ];
    }

    // Fallback if cURL is unavailable
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ]);

    $raw = @file_get_contents($url, false, $context);
    $status = 0;
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $status = (int) $matches[1];
    }

    return [
        'ok' => $raw !== false && $status >= 200 && $status < 300,
        'status' => $status,
        'body' => is_string($raw) ? json_decode($raw, true) : null,
    ];
}

// 1. Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'message' => 'Method not allowed. Only POST requests are accepted.']);
}

// 2. Validate Content-Type
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') === false) {
    respond(415, ['success' => false, 'message' => 'Content-Type must be application/json.']);
}

// 3. Load PHP Configuration securely from outside/inside public_html
$possibleConfigPaths = [];

if (!empty($_ENV['LEADHIVE_CONFIG_PATH']) && is_string($_ENV['LEADHIVE_CONFIG_PATH'])) {
    $possibleConfigPaths[] = $_ENV['LEADHIVE_CONFIG_PATH'];
}

$docRoot = $_SERVER['DOCUMENT_ROOT'] ?? '';
if ($docRoot !== '') {
    // /home/CPANEL_USERNAME/leadhive-config.php (outside public_html)
    $possibleConfigPaths[] = dirname($docRoot) . DIRECTORY_SEPARATOR . 'leadhive-config.php';
    // Fallback inside doc root
    $possibleConfigPaths[] = $docRoot . DIRECTORY_SEPARATOR . 'leadhive-config.php';
}

// Standard relative paths: two directories up (parent of public_html or dist)
$possibleConfigPaths[] = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'leadhive-config.php';
// One directory up (inside public_html or dist)
$possibleConfigPaths[] = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'leadhive-config.php';
// Same directory as API
$possibleConfigPaths[] = __DIR__ . DIRECTORY_SEPARATOR . 'leadhive-config.php';

$config = null;
foreach ($possibleConfigPaths as $configPath) {
    if (is_readable($configPath)) {
        $loaded = @require $configPath;
        if (is_array($loaded)) {
            $config = $loaded;
            break;
        }
    }
}

if (!is_array($config)) {
    // Fail safely without exposing internal paths
    respond(500, ['success' => false, 'message' => "We couldn't submit your request. Please try again."]);
}

$resendApiKey = clean_string($config['resend_api_key'] ?? '', 256);
$recaptchaSecret = clean_string($config['recaptcha_secret_key'] ?? $config['recaptcha_secret'] ?? '', 256);
$fromEmail = clean_string($config['from_email'] ?? $config['resend_from_email'] ?? 'LeadHive AI <hello@leadhive-ai.com>', 256);
$toEmail = clean_string($config['to_email'] ?? $config['contact_to_email'] ?? '', 256);

// Validate that configuration keys are present and not unreplaced placeholders
$isConfigValid = $resendApiKey !== '' && !str_starts_with($resendApiKey, 'PASTE_') && !str_starts_with($resendApiKey, 'YOUR_')
    && $recaptchaSecret !== '' && !str_starts_with($recaptchaSecret, 'PASTE_') && !str_starts_with($recaptchaSecret, 'YOUR_')
    && $toEmail !== '' && !str_starts_with($toEmail, 'PASTE_') && !str_starts_with($toEmail, 'YOUR_')
    && filter_var($toEmail, FILTER_VALIDATE_EMAIL) !== false;

if (!$isConfigValid) {
    respond(500, ['success' => false, 'message' => "We couldn't submit your request. Please try again."]);
}

// 4. Parse JSON body
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput ?: '', true);

if (!is_array($data)) {
    respond(400, ['success' => false, 'message' => 'Invalid JSON payload.']);
}

// 5. Anti-spam honeypot check (hidden field)
if (!empty($data['website'])) {
    // Return fake success to bots silently
    respond(200, ['success' => true, 'message' => 'Thank you. Your request has been received. Our team will contact you shortly.']);
}

// 6. Extract & sanitize fields
$name = clean_string($data['name'] ?? '', 120);
$email = clean_string($data['email'] ?? '', 180);
$company = clean_string($data['company'] ?? '', 160);
$channels = clean_string($data['channels'] ?? '', 80);
$volume = clean_string($data['volume'] ?? '', 80);
$message = clean_string($data['message'] ?? '', 2000, false);
$captchaToken = clean_string($data['recaptchaToken'] ?? $data['captchaToken'] ?? '', 4096);

// 7. Validate required fields
if ($name === '' || $email === '' || $company === '' || $channels === '' || $volume === '' || $captchaToken === '') {
    respond(422, ['success' => false, 'message' => 'Please fill in all required fields and complete the reCAPTCHA.']);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['success' => false, 'message' => 'Please enter a valid work email address.']);
}

// Validate dropdown options against allowed choices
$allowedChannels = ['WhatsApp', 'Instagram', 'Facebook Messenger', 'Website chat', 'Multiple channels'];
$allowedVolumes = ['Under 1,000', '1,000-5,000', '5,000-20,000', '20,000+'];

if (!in_array($channels, $allowedChannels, true) || !in_array($volume, $allowedVolumes, true)) {
    respond(422, ['success' => false, 'message' => 'Please select valid form options.']);
}

// 8. Server-side Google reCAPTCHA v2 verification
$recaptchaResponse = post_curl_form('https://www.google.com/recaptcha/api/siteverify', [
    'secret' => $recaptchaSecret,
    'response' => $captchaToken,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
]);

if (!$recaptchaResponse['ok'] || empty($recaptchaResponse['body']['success'])) {
    respond(403, ['success' => false, 'message' => 'reCAPTCHA verification failed. Please try again.']);
}

// 9. Build Email Content
$submissionDate = gmdate('Y-m-d H:i:s') . ' UTC';

$fields = [
    'Name' => $name,
    'Work Email' => $email,
    'Company' => $company,
    'Primary Channels' => $channels,
    'Monthly Conversation Volume' => $volume,
];

if ($message !== '') {
    $fields['Message'] = $message;
}

$fields['Submitted At'] = $submissionDate;

$tableRowsHtml = '';
$textLines = [];

foreach ($fields as $label => $value) {
    $tableRowsHtml .= '<tr>';
    $tableRowsHtml .= '<th align="left" style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;font-weight:600;width:35%;background-color:#f8fafc;">' . html_escape($label) . '</th>';
    $tableRowsHtml .= '<td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;color:#334155;font-size:14px;line-height:1.5;">' . nl2br(html_escape($value)) . '</td>';
    $tableRowsHtml .= '</tr>';

    $textLines[] = $label . ': ' . $value;
}

$cleanSubjectName = preg_replace('/[^a-zA-Z0-9 ._\'-]/', '', $name) ?: 'New Prospect';
$emailSubject = 'New LeadHive AI Demo Request - ' . $cleanSubjectName;

$emailHtml = '<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>' . html_escape($emailSubject) . '</title>
</head>
<body style="margin:0;padding:24px;background-color:#031027;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.25);">
    <tr>
      <td style="background:#031027;padding:28px 32px;border-bottom:3px solid #22d3ee;">
        <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;letter-spacing:-0.3px;">LeadHive AI</h1>
        <p style="margin:6px 0 0;font-size:14px;color:#94a3b8;">New Book a Demo Request</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 20px;font-size:15px;color:#334155;line-height:1.5;">You received a new demo inquiry from the LeadHive AI website:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          ' . $tableRowsHtml . '
        </table>
      </td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center;">
        <p style="margin:0;font-size:12px;color:#64748b;">LeadHive AI Platform &bull; Secure Demo Lead Notification</p>
      </td>
    </tr>
  </table>
</body>
</html>';

$emailText = "New LeadHive AI Demo Request\n\n" . implode("\n", $textLines) . "\n\n--\nLeadHive AI Platform";

// 10. Send Email via Resend REST API
$resendPayload = [
    'from' => $fromEmail,
    'to' => [$toEmail],
    'reply_to' => $email,
    'subject' => $emailSubject,
    'html' => $emailHtml,
    'text' => $emailText,
];

$resendResponse = post_curl_json('https://api.resend.com/emails', [
    'Authorization: Bearer ' . $resendApiKey,
    'Content-Type: application/json',
], $resendPayload);

if (!$resendResponse['ok']) {
    respond(502, ['success' => false, 'message' => "We couldn't submit your request. Please try again."]);
}

// 11. Return clean success response
respond(200, ['success' => true, 'message' => 'Thank you. Your request has been received. Our team will contact you shortly.']);
