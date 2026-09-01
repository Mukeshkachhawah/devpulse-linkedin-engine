$ErrorActionPreference = 'Stop'

$projectDir = Split-Path -Parent $PSScriptRoot
$enableMarker = Join-Path $projectDir 'settings\linkedin-daily-post.enabled'
$settingsPath = Join-Path $projectDir 'settings\linkedin-daily-post.json'

if (-not (Test-Path -LiteralPath $enableMarker)) {
    throw 'LinkedIn daily posting is disabled. Complete the authenticated first-post test before enabling it.'
}

$settings = Get-Content -Raw -LiteralPath $settingsPath | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace([string]$settings.expected_account)) {
    throw 'Set expected_account in settings/linkedin-daily-post.json before enabling automation.'
}

$gitShDir = 'C:\Program Files\Git\bin'
if (-not (Test-Path -LiteralPath (Join-Path $gitShDir 'sh.exe'))) {
    throw 'Git for Windows sh.exe was not found at C:\Program Files\Git\bin\sh.exe.'
}

$codexResolver = Join-Path $PSScriptRoot 'Resolve-Codex.ps1'
$codexExecutable = & $codexResolver
$codexDir = Split-Path -Parent $codexExecutable

$env:PATH = "$codexDir;$gitShDir;$env:PATH"
$env:NOODLE_NO_BROWSER = '1'
Set-Location -LiteralPath $projectDir
& noodle --project-dir $projectDir start
exit $LASTEXITCODE
