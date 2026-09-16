Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
$zip = [System.IO.Compression.ZipFile]::OpenRead('d:\DO-AN\cot_truyen\mau\cot-truyen-hoan-chinh-v1.docx')
foreach ($entry in $zip.Entries) {
    if ($entry.FullName -eq 'word/document.xml') {
        $stream = $entry.Open()
        $reader = New-Object System.IO.StreamReader($stream)
        $content = $reader.ReadToEnd()
        $reader.Close()
        $stream.Close()
        $plain = [System.Text.RegularExpressions.Regex]::Replace($content, '<[^>]+>', ' ')
        $plain = [System.Text.RegularExpressions.Regex]::Replace($plain, '\s+', ' ')
        $plain | Out-File -FilePath 'd:\DO-AN\SEQ\cot_truyen_text.txt' -Encoding UTF8
        Write-Host "Extracted"
    }
}
$zip.Dispose()