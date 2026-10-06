param([string]$Kind='sprite',[string]$Status='',[string]$Output='contact.png',[string]$JobFile='jobs.json',[switch]$Original,[switch]$Draft,[int]$Columns=6,[int]$CellWidth=200,[int]$CellHeight=260)
Add-Type -AssemblyName System.Drawing
$allJobs=Get-Content -Raw -Encoding utf8 "$PSScriptRoot/$JobFile" | ConvertFrom-Json
$jobs=@($allJobs | Where-Object { (!$Kind -or $_.kind -eq $Kind) -and (!$Status -or $_.status -eq $Status) })
$sheet=[Drawing.Bitmap]::new(($Columns*$CellWidth),([int][Math]::Ceiling($jobs.Count/$Columns)*$CellHeight))
$g=[Drawing.Graphics]::FromImage($sheet)
$g.Clear([Drawing.Color]::FromArgb(239,239,239))
$font=[Drawing.Font]::new('Arial',9)
for($i=0;$i -lt $jobs.Count;$i++) {
  $p=if($Original){$jobs[$i].original}elseif($Draft -and $jobs[$i].draft){$jobs[$i].draft}else{$jobs[$i].targets[0]}
  $img=[Drawing.Image]::FromFile($p)
  $xx=($i%$Columns)*$CellWidth
  $yy=[int][Math]::Floor($i/$Columns)*$CellHeight
  $scale=[Math]::Min(($CellWidth-10)/$img.Width,($CellHeight-40)/$img.Height)
  $w=[int]($img.Width*$scale); $h=[int]($img.Height*$scale)
  $g.DrawImage($img,($xx+[int](($CellWidth-$w)/2)),$yy,$w,$h)
  $g.DrawString($jobs[$i].id,$font,[Drawing.Brushes]::Black,[Drawing.RectangleF]::new($xx,$yy+$CellHeight-38,$CellWidth,38))
  $img.Dispose()
}
$sheet.Save((Join-Path $PSScriptRoot $Output))
$g.Dispose(); $sheet.Dispose(); $font.Dispose()
