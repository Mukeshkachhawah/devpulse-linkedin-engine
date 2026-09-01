$ErrorActionPreference = 'Stop'
$todosPath = if ($env:NOODLE_TODOS_FILE) { $env:NOODLE_TODOS_FILE } else { 'todos.md' }

if (-not (Test-Path -LiteralPath $todosPath)) {
    exit 0
}

$section = ''
foreach ($line in Get-Content -LiteralPath $todosPath) {
    if ($line -match '^##\s+(.+)$') {
        $section = $Matches[1].Trim()
        continue
    }

    if ($line -notmatch '^(\d+)\. \[([ xX])\] (.+)$') {
        continue
    }

    $item = [ordered]@{
        id = $Matches[1]
        title = $Matches[3].Trim()
        status = if ($Matches[2] -match '[xX]') { 'done' } else { 'open' }
    }
    if ($section) {
        $item.section = $section
    }
    $item | ConvertTo-Json -Compress
}
