<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $statusCode, array $payload): never
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

function clean_string(mixed $value, int $maxLength): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = trim($value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    $value = preg_replace('/[[:cntrl:]]/', '', $value) ?? '';

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength);
    }

    return substr($value, 0, $maxLength);
}

function html_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function post_json(string $url, array $headers, array $payload): array
{
    $body = json_encode($payload);

    if ($body === false) {
        return ['ok' => false, 'status' => 0, 'body' => null, 'raw' => ''];
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
        ]);

        $raw = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        return [
            'ok' => $raw !== false && $status >= 200 && $status < 300,
            'status' => $status,
            'body' => is_string($raw) ? json_decode($raw, true) : null,
            'raw' => is_string($raw) ? $raw : $error,
        ];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers),
            'content' => $body,
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ]);

    $raw = file_get_contents($url, false, $context);
    $status = 0;

    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $status = (int) $matches[1];
    }

    return [
        'ok' => $raw !== false && $status >= 200 && $status < 300,
        'status' => $status,
        'body' => is_string($raw) ? json_decode($raw, true) : null,
        'raw' => is_string($raw) ? $raw : '',
    ];
}

function post_form(string $url, array $payload): array
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
        ]);

        $raw = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        return [
            'ok' => $raw !== false && $status >= 200 && $status < 300,
            'status' => $status,
            'body' => is_string($raw) ? json_decode($raw, true) : null,
            'raw' => is_string($raw) ? $raw : $error,
        ];
    }

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $body,
            'timeout' => 20,
            'ignore_errors' => true,
        ],
    ]);

    $raw = file_get_contents($url, false, $context);
    $status = 0;

    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $status = (int) $matches[1];
    }

    return [
        'ok' => $raw !== false && $status >= 200 && $status < 300,
        'status' => $status,
        'body' => is_string($raw) ? json_decode($raw, true) : null,
        'raw' => is_string($raw) ? $raw : '',
    ];
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Method not allowed.']);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') === false) {
    respond(415, ['success' => false, 'message' => 'Content-Type must be application/json.']);
}

$configPaths = [
    dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'leadhive-config.php',
    dirname(__DIR__) . DIRECTORY_SEPARATOR . 'leadhive-config.php',
];

$config = null;
foreach ($configPaths as $configPath) {
    if (is_readable($configPath)) {
        $loadedConfig = require $configPath;
        if (is_array($loadedConfig)) {
            $config = $loadedConfig;
            break;
        }
    }
}

if (!is_array($config)) {
    respond(500, ['success' => false, 'message' => 'Server configuration is missing.']);
}

$requiredConfig = ['recaptcha_secret', 'resend_api_key', 'resend_from_email', 'contact_to_email'];
foreach ($requiredConfig as $key) {
    if (empty($config[$key]) || !is_string($config[$key])) {
        respond(500, ['success' => false, 'message' => 'Server configuration is incomplete.']);
    }
}

$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput ?: '', true);

if (!is_array($data)) {
    respond(400, ['success' => false, 'message' => 'Invalid JSON request.']);
}

if (!empty($data['website'])) {
    respond(200, ['success' => true, 'message' => 'Thank you.']);
}

$name = clean_string($data['name'] ?? '', 120);
$email = clean_string($data['email'] ?? '', 180);
$company = clean_string($data['company'] ?? '', 160);
$channels = clean_string($data['channels'] ?? '', 80);
$volume = clean_string($data['volume'] ?? '', 80);
$captchaToken = clean_string($data['captchaToken'] ?? '', 4096);

if ($name === '' || $email === '' || $company === '' || $channels === '' || $volume === '' || $captchaToken === '') {
    respond(422, ['success' => false, 'message' => 'Please complete all required fields and reCAPTCHA.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['success' => false, 'message' => 'Please enter a valid work email address.']);
}

$allowedChannels = ['WhatsApp', 'Instagram', 'Facebook Messenger', 'Website chat', 'Multiple channels'];
$allowedVolumes = ['Under 1,000', '1,000-5,000', '5,000-20,000', '20,000+'];

if (!in_array($channels, $allowedChannels, true) || !in_array($volume, $allowedVolumes, true)) {
    respond(422, ['success' => false, 'message' => 'Please choose valid form options.']);
}

$recaptcha = post_form('https://www.google.com/recaptcha/api/siteverify', [
    'secret' => $config['recaptcha_secret'],
    'response' => $captchaToken,
    'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
]);

if (!$recaptcha['ok'] || empty($recaptcha['body']['success'])) {
    respond(403, ['success' => false, 'message' => 'reCAPTCHA verification failed.']);
}

$safeFields = [
    'Name' => $name,
    'Work Email' => $email,
    'Company' => $company,
    'Primary Channels' => $channels,
    'Monthly Conversation Volume' => $volume,
];

$htmlRows = '';
$textLines = [];
foreach ($safeFields as $label => $value) {
    $htmlRows .= '<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#0f172a;">' . html_escape($label) . '</th><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#334155;">' . html_escape($value) . '</td></tr>';
    $textLines[] = $label . ': ' . $value;
}

$subjectName = preg_replace('/[^a-zA-Z0-9 ._\'-]/', '', $name) ?: 'New enquiry';
$subject = 'New LeadHive Contact Inquiry - ' . $subjectName;

$emailPayload = [
    'from' => 'LeadHive Website <' . $config['resend_from_email'] . '>',
    'to' => [$config['contact_to_email']],
    'reply_to' => $email,
    'subject' => $subject,
    'html' => '<div style="font-family:Arial,sans-serif;line-height:1.5;color:#0f172a;"><h2 style="margin:0 0 16px;">New LeadHive contact inquiry</h2><table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;border:1px solid #e5e7eb;">' . $htmlRows . '</table></div>',
    'text' => "New LeadHive contact inquiry\n\n" . implode("\n", $textLines),
];

$resend = post_json('https://api.resend.com/emails', [
    'Authorization: Bearer ' . $config['resend_api_key'],
    'Content-Type: application/json',
], $emailPayload);

if (!$resend['ok']) {
    respond(502, ['success' => false, 'message' => 'We could not send your request right now. Please try again later.']);
}

respond(200, ['success' => true, 'message' => 'Thanks. Your demo request has been sent.']);
