param([Parameter(Mandatory = $true)][string]$Id)

$ErrorActionPreference = 'Stop'
$todosPath = if ($env:NOODLE_TODOS_FILE) { $env:NOODLE_TODOS_FILE } else { 'todos.md' }
$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace($payload.title)) {
    throw 'title required'
}
if (-not (Test-Path -LiteralPath $todosPath)) {
    throw 'todos file not found'
}

$content = Get-Content -Raw -LiteralPath $todosPath
$pattern = "(?m)^$([regex]::Escape($Id))\. \[([ xX])\] .*$"
$replacement = "$Id. [`$1] $($payload.title)"
$updated = [regex]::Replace($content, $pattern, $replacement, 1)
Set-Content -LiteralPath $todosPath -Encoding UTF8 -Value $updated
