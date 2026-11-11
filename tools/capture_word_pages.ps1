param([string]$Docx, [string]$OutDir, [int[]]$Pages)
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open($Docx, $false, $true)
    foreach ($page in $Pages) {
        $start = $doc.GoTo(1, 1, $page)
        if ($page -lt $doc.ComputeStatistics(2)) {
            $next = $doc.GoTo(1, 1, $page + 1)
            $range = $doc.Range($start.Start, $next.Start - 1)
        } else {
            $range = $doc.Range($start.Start, $doc.Content.End - 1)
        }
        $range.Select()
        $word.Selection.CopyAsPicture()
        Start-Sleep -Milliseconds 500
        $image = [Windows.Forms.Clipboard]::GetImage()
        if ($null -eq $image) { throw "Clipboard image missing for page $page" }
        $path = Join-Path $OutDir ("word-page-{0:D2}.png" -f $page)
        $image.Save($path, [Drawing.Imaging.ImageFormat]::Png)
        $image.Dispose()
    }
    $doc.Close($false)
}
finally { $word.Quit() }
