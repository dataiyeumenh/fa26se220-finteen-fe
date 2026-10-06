param([string]$OutputDir='D:/DO-AN/SEQ/output/scene-character-audit')
$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
New-Item -ItemType Directory -Force $OutputDir | Out-Null
$base='D:/DO-AN/SEQ/public/images/finteen-v2'
$font=[Drawing.Font]::new('Arial',13)
for($chapter=1;$chapter -le 6;$chapter++) {
  $folder=Join-Path $base ('chapter-{0:d2}' -f $chapter)
  $sprites=@(Get-ChildItem "$folder/char" -Recurse -Filter '*-neutral.png')
  $scenes=@(Get-ChildItem "$folder/scene" -Filter '*.png' | Sort-Object Name)
  $rows=[int][Math]::Ceiling($scenes.Count/2)
  $sheet=[Drawing.Bitmap]::new(1680,(390+510*$rows))
  $g=[Drawing.Graphics]::FromImage($sheet)
  $g.Clear([Drawing.Color]::FromArgb(240,240,240))
  for($i=0;$i -lt $sprites.Count;$i++) {
    $img=[Drawing.Image]::FromFile($sprites[$i].FullName)
    $scale=[Math]::Min(300/$img.Width,345/$img.Height)
    $w=[int]($img.Width*$scale);$h=[int]($img.Height*$scale)
    $x=($i*330)+[int]((330-$w)/2)
    $g.DrawImage($img,$x,5,$w,$h)
    $g.DrawString($sprites[$i].Name,$font,[Drawing.Brushes]::Black,($i*330+12),355)
    $img.Dispose()
  }
  for($i=0;$i -lt $scenes.Count;$i++) {
    $img=[Drawing.Image]::FromFile($scenes[$i].FullName)
    $x=($i%2)*840;$y=390+[int][Math]::Floor($i/2)*510
    $scale=[Math]::Min(830/$img.Width,470/$img.Height)
    $g.DrawImage($img,$x,$y,[int]($img.Width*$scale),[int]($img.Height*$scale))
    $g.DrawString($scenes[$i].Name,$font,[Drawing.Brushes]::Black,($x+4),($y+473))
    $img.Dispose()
  }
  $sheet.Save((Join-Path $OutputDir ('chapter-{0:d2}-comparison.png' -f $chapter)))
  $g.Dispose();$sheet.Dispose()
}
$font.Dispose()
