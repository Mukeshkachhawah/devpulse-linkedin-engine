param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^(?:[01]\d|2[0-3]):[0-5]\d$')]
    [string]$Time
)

$ErrorActionPreference = 'Stop'
$projectDir = Split-Path -Parent $PSScriptRoot
$settingsPath = Join-Path $projectDir 'settings\linkedin-daily-post.json'
$settings = Get-Content -Raw -LiteralPath $settingsPath | ConvertFrom-Json
$settings.posting_time = $Time
$settings | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $settingsPath -Encoding UTF8

$parts = $Time.Split(':')
$at = (Get-Date).Date.AddHours([int]$parts[0]).AddMinutes([int]$parts[1])
$trigger = New-ScheduledTaskTrigger -Daily -At $at
Set-ScheduledTask -TaskName 'Codex LinkedIn Daily Trigger' -Trigger $trigger | Out-Null
Write-Output "LinkedIn posting time changed to $Time local time."
