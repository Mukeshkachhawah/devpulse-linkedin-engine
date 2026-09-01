$ErrorActionPreference = 'Stop'

$command = Get-Command codex -ErrorAction SilentlyContinue | Select-Object -First 1
if ($null -ne $command -and -not [string]::IsNullOrWhiteSpace([string]$command.Source)) {
    $command.Source
    exit 0
}

$candidates = @(
    (Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps\codex.exe'),
    (Join-Path $env:APPDATA 'npm\codex.cmd'),
    (Join-Path $env:USERPROFILE '.codex\bin\codex.exe')
)

$extensionRoot = Join-Path $env:USERPROFILE '.vscode\extensions'
if (Test-Path -LiteralPath $extensionRoot) {
    $extensionCandidates = Get-ChildItem -LiteralPath $extensionRoot -Directory -Filter 'openai.chatgpt-*-win32-x64' |
        Sort-Object LastWriteTime -Descending |
        ForEach-Object { Join-Path $_.FullName 'bin\windows-x86_64\codex.exe' }
    $candidates += $extensionCandidates
}

$resolved = $candidates |
    Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } |
    Select-Object -First 1

if ([string]::IsNullOrWhiteSpace([string]$resolved)) {
    throw 'Codex CLI was not found. Install it from the official Codex CLI setup page, then rerun this script.'
}

(Resolve-Path -LiteralPath $resolved).Path
