param(
    [Parameter(Mandatory=$true)][string]$SourceRoot,
    [Parameter(Mandatory=$true)][string]$OutputRoot
)

Add-Type -AssemblyName System.Drawing

function Add-Redaction([Drawing.Graphics]$graphics, [Drawing.Rectangle]$rect) {
    $brush = New-Object Drawing.SolidBrush([Drawing.Color]::FromArgb(34, 39, 49))
    $pen = New-Object Drawing.Pen([Drawing.Color]::FromArgb(34, 39, 49), 1)
    $graphics.FillRectangle($brush, $rect)
    $graphics.DrawRectangle($pen, $rect)
    $font = New-Object Drawing.Font('Arial', 10, [Drawing.FontStyle]::Bold)
    $textBrush = New-Object Drawing.SolidBrush([Drawing.Color]::White)
    $format = New-Object Drawing.StringFormat
    $format.Alignment = [Drawing.StringAlignment]::Center
    $format.LineAlignment = [Drawing.StringAlignment]::Center
    $rectF = New-Object Drawing.RectangleF([single]$rect.X, [single]$rect.Y, [single]$rect.Width, [single]$rect.Height)
    $graphics.DrawString('REDACTED', $font, $textBrush, $rectF, $format)
    $format.Dispose(); $textBrush.Dispose(); $font.Dispose(); $pen.Dispose(); $brush.Dispose()
}

foreach ($browser in @('chrome', 'edge', 'firefox')) {
    $destination = Join-Path $OutputRoot $browser
    New-Item -ItemType Directory -Force -Path $destination | Out-Null

    foreach ($name in @('settings.png', 'learners.png')) {
        $source = Join-Path (Join-Path $SourceRoot $browser) $name
        $target = Join-Path $destination $name
        $bitmap = New-Object Drawing.Bitmap($source)
        $graphics = [Drawing.Graphics]::FromImage($bitmap)
        $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias

        if ($name -eq 'settings.png' -and $bitmap.Width -eq 1024 -and $bitmap.Height -gt 800) {
            Add-Redaction $graphics (New-Object Drawing.Rectangle(828, 12, 166, 54))
            Add-Redaction $graphics (New-Object Drawing.Rectangle(270, 175, 355, 38))
        }
        elseif ($name -eq 'learners.png') {
            Add-Redaction $graphics (New-Object Drawing.Rectangle(828, 12, 166, 54))
            foreach ($rect in @(
                (New-Object Drawing.Rectangle(269, 520, 320, 40)),
                (New-Object Drawing.Rectangle(654, 520, 320, 40)),
                (New-Object Drawing.Rectangle(269, 560, 320, 50)),
                (New-Object Drawing.Rectangle(654, 560, 320, 50)),
                (New-Object Drawing.Rectangle(269, 878, 320, 40)),
                (New-Object Drawing.Rectangle(654, 878, 320, 40)),
                (New-Object Drawing.Rectangle(269, 916, 320, 50)),
                (New-Object Drawing.Rectangle(654, 916, 320, 50))
            )) { Add-Redaction $graphics $rect }
        }

        $graphics.Dispose()
        $bitmap.Save($target, [Drawing.Imaging.ImageFormat]::Png)
        $bitmap.Dispose()
    }
}
