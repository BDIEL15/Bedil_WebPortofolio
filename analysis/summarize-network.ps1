$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$d = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'rea-evidence.json') -Raw | ConvertFrom-Json -Depth 100
$r = $d.records[0]
$n = $r.normalized_result
$events = @($n.events.items)
$requests = @($events | Where-Object kind -eq 'request')
$responses = @($events | Where-Object kind -eq 'response')
$rows = foreach ($req in $requests) {
  $resp = $responses | Where-Object transaction_id -eq $req.transaction_id | Select-Object -First 1
  $content = $events | Where-Object { $_.kind -eq 'network-content' -and $_.transaction_id -eq $req.transaction_id } | Select-Object -First 1
  [ordered]@{
    transaction_id=$req.transaction_id; url=$req.url.url; origin=$req.url.origin
    method=$req.method; resource_type=$req.resource_type; status=$resp.status
    request_sequence=$req.sequence; response_sequence=$resp.sequence
    request_header_names=$req.header_names; response_header_names=$resp.header_names
    body_state=$content.body.state; body_reason=$content.body.reason; body_bytes=$content.body.bytes
    media_type=$content.body.media_type; body_sha256=$content.body.sha256
  }
}
$outputDir = Join-Path $PSScriptRoot 'runtime-client'
[IO.Directory]::CreateDirectory($outputDir) | Out-Null
$manifest = foreach($row in $rows) {
  if ($row.body_state -ne 'captured') { continue }
  $url = [uri]$row.url
  $isRsc = $url.Query.Contains('_rsc=')
  $isRouteJs = $url.AbsolutePath -match '/(?:app/(?:cabinet|projects|writing)/page-|356-)'
  if (-not ($isRsc -or $isRouteJs)) {continue}
  $entry = $events | Where-Object { $_.kind -eq 'network-content' -and $_.transaction_id -eq $row.transaction_id } | Select-Object -First 1
  $relative = if ($isRsc) { ($url.AbsolutePath.Trim('/') + '.rsc.txt') } else { $url.AbsolutePath.Trim('/') }
  $path = Join-Path $outputDir $relative
  [IO.Directory]::CreateDirectory((Split-Path $path -Parent)) | Out-Null
  if ($entry.body.encoding -eq 'base64') { $bytes=[Convert]::FromBase64String($entry.body.content) } else { $bytes=[Text.Encoding]::UTF8.GetBytes($entry.body.content) }
  [IO.File]::WriteAllBytes($path,$bytes)
  [ordered]@{url=$row.url; transaction_id=$row.transaction_id; source_network_content_sequence=$entry.sequence; response_sequence=$row.response_sequence; local_path=$relative; bytes=$bytes.Length; sha256=$entry.body.sha256; representation=$entry.body.representation}
}
$manifest | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $outputDir 'manifest.json') -Encoding utf8
$summary = [ordered]@{
 evidence_id=$r.evidence_id; duration_ms=$n.duration_ms; browser=$n.browser; scenario=$n.scenario
 completeness=$n.completeness; event_retained=$n.events.retained; event_dropped=$n.events.dropped
 event_kind_counts=@($events | Group-Object kind | ForEach-Object { [ordered]@{kind=$_.Name;count=$_.Count}})
 request_count=$requests.Count; request_types=@($requests | Group-Object resource_type | ForEach-Object { [ordered]@{type=$_.Name;count=$_.Count}})
 response_status_counts=@($responses | Group-Object status | ForEach-Object { [ordered]@{status=$_.Name;count=$_.Count}})
 origins=@($requests | Group-Object {$_.url.origin} | ForEach-Object {[ordered]@{origin=$_.Name;count=$_.Count}})
 request_failure_events=@($events | Where-Object { $_.kind -match 'request-failed|requestfailed' -or $_.failure })
 page_error_events=@($events | Where-Object {$_.kind -match 'page-error|pageerror'})
 console_events=@($events | Where-Object {$_.kind -match 'console'})
 transactions=@($rows); extracted_bodies=@($manifest); limitations=$n.limitations
}
$summary | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath (Join-Path $PSScriptRoot 'network-summary.json') -Encoding utf8
Write-Output ('Requests: '+$requests.Count+'; extracted route bodies: '+@($manifest).Count)
Write-Output ('Types: '+(($summary.request_types | ForEach-Object {$_.type+'='+$_.count}) -join ', '))
Write-Output ('Origins: '+(($summary.origins | ForEach-Object {$_.origin+'='+$_.count}) -join ', '))
Write-Output ('Extracted: '+(($manifest | ForEach-Object {$_.local_path}) -join ', '))
