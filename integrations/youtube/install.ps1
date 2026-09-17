param([string]$BackendPath = 'D:\YoutubeAPI')
$ErrorActionPreference = 'Stop'
$resolvedBackend = (Resolve-Path -LiteralPath $BackendPath).Path
$botPath = Join-Path $resolvedBackend 'bot.py'
$templatesPath = Join-Path $resolvedBackend 'Templates'
if (-not (Test-Path -LiteralPath $botPath -PathType Leaf) -or -not (Test-Path -LiteralPath $templatesPath -PathType Container)) {
  throw 'The selected directory must contain YoutubeAPI bot.py and Templates.'
}
$encoding = New-Object System.Text.UTF8Encoding($false)
$botSource = [System.IO.File]::ReadAllText($botPath)
$guardImport = 'from trial_guard import check_and_increment_trial'
if (-not $botSource.Contains($guardImport) -and -not $botSource.Contains('from dotenv import load_dotenv')) {
  throw 'The backend imports differ from the inspected version; install the trial-guard import manually.'
}
$backupPath = Join-Path $resolvedBackend '.leadhive-ui-backup'
New-Item -ItemType Directory -Force -Path $backupPath | Out-Null
$botBackup = Join-Path $backupPath 'bot.py.before-trial-guard'
if (-not (Test-Path -LiteralPath $botBackup)) { Copy-Item -LiteralPath $botPath -Destination $botBackup }
foreach ($filename in @('index.html', 'select_channel.html', 'setup.html', 'select_videos.html', 'dashboard.html', 'analytics.html')) {
  $templatePath = Join-Path $templatesPath $filename
  $backupFile = Join-Path $backupPath $filename
  if (-not (Test-Path -LiteralPath $backupFile)) { Copy-Item -LiteralPath $templatePath -Destination $backupFile }
  Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'legacy-shell.html') -Destination $templatePath
}
foreach ($filename in @('leadhive_app.py', 'trial_guard.py')) {
  Copy-Item -LiteralPath (Join-Path $PSScriptRoot $filename) -Destination (Join-Path $resolvedBackend $filename)
}
if (-not $botSource.Contains($guardImport)) {
  $botSource = $botSource.Replace('from dotenv import load_dotenv', "from dotenv import load_dotenv`n$guardImport")
  [System.IO.File]::WriteAllText($botPath, $botSource, $encoding)
}
$ignorePath = Join-Path $resolvedBackend '.gitignore'
$ignoreText = if (Test-Path -LiteralPath $ignorePath) { [System.IO.File]::ReadAllText($ignorePath) } else { '' }
$ignorePatterns = @('.env', 'client_secrets.json', 'user_tokens.json', 'business_profiles.json', 'bot_schedules.json', 'target_videos.json', 'logs.json', 'replied_comments.json', 'trial_usage.json', 'trial_usage.lock', '.trial-*.tmp', '.leadhive-ui-backup/', '__pycache__/', 'venv/')
foreach ($pattern in $ignorePatterns) {
  if (($ignoreText -split '\r?\n') -notcontains $pattern) { $ignoreText = $ignoreText.TrimEnd() + "`n$pattern`n" }
}
[System.IO.File]::WriteAllText($ignorePath, $ignoreText, $encoding)
Write-Output 'LeadHive integration installed. Restart the adapter to load changes.'
