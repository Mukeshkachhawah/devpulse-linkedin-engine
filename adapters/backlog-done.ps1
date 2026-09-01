param([Parameter(Mandatory = $true)][string]$Id)

$ErrorActionPreference = 'Stop'
$todosPath = if ($env:NOODLE_TODOS_FILE) { $env:NOODLE_TODOS_FILE } else { 'todos.md' }
if (-not (Test-Path -LiteralPath $todosPath)) {
    throw 'todos file not found'
}

$content = Get-Content -Raw -LiteralPath $todosPath
$pattern = "(?m)^$([regex]::Escape($Id))\. \[ \]"
$updated = [regex]::Replace($content, $pattern, "$Id. [x]", 1)
Set-Content -LiteralPath $todosPath -Encoding UTF8 -Value $updated
