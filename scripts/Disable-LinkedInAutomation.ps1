$ErrorActionPreference = 'Stop'

$projectDir = Split-Path -Parent $PSScriptRoot
$enableMarker = Join-Path $projectDir 'settings\linkedin-daily-post.enabled'

if (Test-Path -LiteralPath $enableMarker) {
    Remove-Item -LiteralPath $enableMarker -Force
}
Disable-ScheduledTask -TaskName 'Codex LinkedIn Noodle Loop' | Out-Null
Disable-ScheduledTask -TaskName 'Codex LinkedIn Daily Trigger' | Out-Null
Write-Output 'LinkedIn daily posting automation disabled.'
