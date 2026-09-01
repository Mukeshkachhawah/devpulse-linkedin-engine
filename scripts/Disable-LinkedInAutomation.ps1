$ErrorActionPreference = 'Stop'

$projectDir = Split-Path -Parent $PSScriptRoot
$enableMarker = Join-Path $projectDir 'settings\linkedin-daily-post.enabled'
$todosPath = Join-Path $projectDir 'todos.md'

if (Test-Path -LiteralPath $enableMarker) {
    Remove-Item -LiteralPath $enableMarker -Force
}
$todos = Get-Content -Raw -LiteralPath $todosPath
$todos = $todos -replace '(?m)^1\. \[ \] Daily LinkedIn scheduler sentinel', '1. [x] Daily LinkedIn scheduler sentinel'
Set-Content -LiteralPath $todosPath -Encoding UTF8 -Value $todos
Disable-ScheduledTask -TaskName 'Codex LinkedIn Noodle Loop' | Out-Null
Disable-ScheduledTask -TaskName 'Codex LinkedIn Daily Trigger' | Out-Null
Write-Output 'LinkedIn daily posting automation disabled.'
