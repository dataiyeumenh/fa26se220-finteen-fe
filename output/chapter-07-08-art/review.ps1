Add-Type -AssemblyName System.Drawing
$root = 'D:\DO-AN\SEQ\public\images\finteen-v2'
$out = 'D:\DO-AN\SEQ\output\chapter-07-08-art'
foreach ($chapter in @('chapter-07','chapter-08')) {
  $files = @(Get-ChildItem -LiteralPath "$root\$chapter" -Recurse -Filter *.png | Sort-Object FullName)
  $cols = 4; $cw = 360; $ch = 270
  $sheet = [Drawing.Bitmap]::new($cols*$cw,[int][Math]::Ceiling($files.Count/$cols)*$ch)
  $g = [Drawing.Graphics]::FromImage($sheet)
  $g.Clear([Drawing.Color]::FromArgb(241,237,228))
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $font = [Drawing.Font]::new('Arial',10)
  for($i=0;$i -lt $files.Count;$i++) {
    $f=$files[$i]; $im=[Drawing.Image]::FromFile($f.FullName)
    $x=($i%$cols)*$cw; $y=[int][Math]::Floor($i/$cols)*$ch
    $scale=[Math]::Min(($cw-16)/$im.Width,($ch-45)/$im.Height)
    $w=[int]($im.Width*$scale);$h=[int]($im.Height*$scale)
    $g.FillRectangle([Drawing.Brushes]::White,$x+4,$y+4,$cw-8,$ch-8)
    $g.DrawImage($im,$x+[int](($cw-$w)/2),$y+8,$w,$h)
    $g.DrawString($f.BaseName,$font,[Drawing.Brushes]::Black,[single]($x+8),[single]($y+$ch-30))
    $im.Dispose()
  }
  $sheet.Save("$out\$chapter-review.png",[Drawing.Imaging.ImageFormat]::Png)
  $font.Dispose();$g.Dispose();$sheet.Dispose()
}
