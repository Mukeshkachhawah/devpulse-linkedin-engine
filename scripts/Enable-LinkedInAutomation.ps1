param([switch]$FirstPostApproved)

$ErrorActionPreference = 'Stop'
if (-not $FirstPostApproved) {
    throw 'Enablement requires -FirstPostApproved after the authenticated first test post is approved.'
}

$projectDir = Split-Path -Parent $PSScriptRoot
$settingsPath = Join-Path $projectDir 'settings\linkedin-daily-post.json'
$enableMarker = Join-Path $projectDir 'settings\linkedin-daily-post.enabled'
$settings = Get-Content -Raw -LiteralPath $settingsPath | ConvertFrom-Json

if ([string]::IsNullOrWhiteSpace([string]$settings.expected_account)) {
    throw 'Set expected_account in settings/linkedin-daily-post.json first.'
}

New-Item -ItemType File -Path $enableMarker -Force | Out-Null
Enable-ScheduledTask -TaskName 'Codex LinkedIn Noodle Loop' | Out-Null
Enable-ScheduledTask -TaskName 'Codex LinkedIn Daily Trigger' | Out-Null
Start-ScheduledTask -TaskName 'Codex LinkedIn Noodle Loop'
Write-Output 'LinkedIn daily posting automation enabled.'
