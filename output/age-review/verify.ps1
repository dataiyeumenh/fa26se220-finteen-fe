param([switch]$RequireComplete)
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$jobs=Get-Content -Raw -Encoding utf8 "$PSScriptRoot/chibi-jobs.json" | ConvertFrom-Json
$results=@()
foreach($job in $jobs) {
  if($job.status -eq 'keep-original') {
    foreach($target in $job.targets) {
      if((Get-FileHash -LiteralPath $target).Hash -ne (Get-FileHash -LiteralPath $job.original).Hash) { throw "Adult sprite changed: $target" }
    }
    continue
  }
  if($job.status -notin @('draft-ready','installed')) {
    if($RequireComplete) {throw "Unfinished: $($job.id)"}
    continue
  }
  $img=[Drawing.Bitmap]::FromFile($job.draft)
  $corners=@($img.GetPixel(0,0).A,$img.GetPixel(($img.Width-1),0).A,$img.GetPixel(0,($img.Height-1)).A,$img.GetPixel(($img.Width-1),($img.Height-1)).A)
  if($job.kind -eq 'sprite' -and ($corners | Where-Object {$_ -ne 0})) {throw "Sprite has nontransparent corner: $($job.id)"}
  if($job.kind -eq 'scene' -and ($corners | Where-Object {$_ -ne 255})) {throw "Scene has transparent corner: $($job.id)"}
  $results += [pscustomobject]@{ID=$job.id;Kind=$job.kind;Width=$img.Width;Height=$img.Height;CornerAlpha=($corners -join ',');Status=$job.status}
  $img.Dispose()
  if($job.status -eq 'installed') {
    $draftHash=(Get-FileHash -LiteralPath $job.draft).Hash
    foreach($target in $job.targets) {if((Get-FileHash -LiteralPath $target).Hash -ne $draftHash){throw "Installed mismatch: $target"}}
  }
}
$results | ConvertTo-Json -Depth 4 | Set-Content -Encoding utf8 "$PSScriptRoot/verification.json"
[pscustomobject]@{VerifiedUniqueImages=$results.Count;AdultModels=@($jobs | Where-Object {$_.adult}).Count;InstalledCopies=($jobs | Where-Object {$_.status -eq 'installed'} | ForEach-Object {$_.targets.Count} | Measure-Object -Sum).Sum;Remaining=@($jobs | Where-Object {$_.status -eq 'pending'}).Count} | ConvertTo-Json
