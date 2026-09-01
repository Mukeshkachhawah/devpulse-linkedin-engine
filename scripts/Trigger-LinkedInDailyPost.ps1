$ErrorActionPreference = 'Stop'

$projectDir = Split-Path -Parent $PSScriptRoot
$enableMarker = Join-Path $projectDir 'settings\linkedin-daily-post.enabled'

if (-not (Test-Path -LiteralPath $enableMarker)) {
    exit 0
}

Set-Location -LiteralPath $projectDir
$env:NOODLE_NO_BROWSER = '1'

$statusOutput = & noodle status 2>&1 | Out-String
if ($LASTEXITCODE -eq 0 -and $statusOutput -match '(?i)running') {
    & noodle --project-dir $projectDir event emit 'linkedin.daily' --payload '{"source":"windows-task-scheduler"}'
    exit $LASTEXITCODE
}

& noodle --project-dir $projectDir start
exit $LASTEXITCODE
