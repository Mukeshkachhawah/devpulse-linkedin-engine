$ErrorActionPreference = 'Stop'

$resolver = Join-Path $PSScriptRoot 'Resolve-Codex.ps1'
$codexExecutable = & $resolver

Write-Host "Using Codex CLI: $codexExecutable"
Write-Host 'Complete the sign-in flow in the browser. Do not paste credentials or tokens into PowerShell or chat.'

& $codexExecutable login
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

& $codexExecutable login status
exit $LASTEXITCODE
