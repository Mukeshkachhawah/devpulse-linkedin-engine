$ErrorActionPreference = 'Stop'
$todosPath = if ($env:NOODLE_TODOS_FILE) { $env:NOODLE_TODOS_FILE } else { 'todos.md' }
$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace($payload.title)) {
    throw 'title required'
}

if (-not (Test-Path -LiteralPath $todosPath)) {
    Set-Content -LiteralPath $todosPath -Encoding UTF8 -Value @('# Todos', '', '<!-- next-id: 1 -->', '', '## Inbox')
}

$content = Get-Content -Raw -LiteralPath $todosPath
$nextId = if ($content -match 'next-id:\s*(\d+)') { [int]$Matches[1] } else { 1 }
$section = if ([string]::IsNullOrWhiteSpace($payload.section)) { 'Inbox' } else { [string]$payload.section }

if ($content -notmatch "(?m)^##\s+$([regex]::Escape($section))\s*$") {
    Add-Content -LiteralPath $todosPath -Encoding UTF8 -Value "`n## $section"
}
Add-Content -LiteralPath $todosPath -Encoding UTF8 -Value "$nextId. [ ] $($payload.title)"

$updated = Get-Content -Raw -LiteralPath $todosPath
$updated = [regex]::Replace($updated, 'next-id:\s*\d+', "next-id: $($nextId + 1)", 1)
Set-Content -LiteralPath $todosPath -Encoding UTF8 -Value $updated
$nextId
