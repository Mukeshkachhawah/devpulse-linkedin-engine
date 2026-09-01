$ErrorActionPreference = 'Stop'

$projectDir = Split-Path -Parent $PSScriptRoot
$enableMarker = Join-Path $projectDir 'settings\linkedin-daily-post.enabled'

if (-not (Test-Path -LiteralPath $enableMarker)) {
    exit 0
}

Set-Location -LiteralPath $projectDir
$gitShDir = 'C:\Program Files\Git\bin'
$env:PATH = "$gitShDir;$env:PATH"
& noodle --project-dir $projectDir event emit 'linkedin.daily' --payload '{"source":"windows-task-scheduler"}'
exit $LASTEXITCODE
