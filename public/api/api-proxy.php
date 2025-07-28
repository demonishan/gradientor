<?php
header('Content-Type: application/json');

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Allowed origin
$allowed_origin = 'https://666de666.com';

// Check Origin or Referer
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
if ($origin !== $allowed_origin && strpos($referer, $allowed_origin) !== 0) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden - Invalid origin']);
    exit;
}

// Store Contentful keys directly in the file
$space_id = 'pindpkvc3ott';
$access_token = 'oAJSYoaLUa0XI-hvHmPrZZjoFwDVVb0ebZ0Z_VjvKv0';
$environment = 'master'; // or your environment

if (!$space_id || !$access_token) {
    http_response_code(500);
    echo json_encode(['error' => 'Missing Contentful API keys']);
    exit;
}

// Return keys as JSON
echo json_encode([
    'SPACE_ID' => $space_id,
    'ACCESS_TOKEN' => $access_token,
    'ENVIRONMENT' => $environment
]);