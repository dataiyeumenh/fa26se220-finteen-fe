param(
    [Parameter(Mandatory=$true)][string]$Source,
    [Parameter(Mandatory=$true)][string]$Target,
    [Parameter(Mandatory=$true)][string]$Assets
)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

function Replace-Paragraph([object]$doc, [string]$prefix, [string]$new) {
    $range = $doc.Content
    $find = $range.Find
    $find.ClearFormatting()
    $find.Text = $prefix
    $find.Forward = $true
    $find.Wrap = 0
    if (-not $find.Execute()) { throw "Text not found: $prefix" }
    $paragraph = $range.Paragraphs.Item(1).Range
    $paragraph.Text = $new + "`r"
}

try {
    $doc = $word.Documents.Open($Source, $false, $false)

    Replace-Paragraph $doc `
        'Figure 3. Current system context.' `
        'Figure 3. Current system context. PayOS runs in production. Firebase provides Google sign-in, Brevo provides SMTP mail, Cloudflare provides CDN delivery, and Gemini with OpenRouter fallback supports Studio reading suggestions. GitHub Actions with VieNeu-TTS pre-generates narration audio. The Android application remains planned for a later iteration. Editable source: Diagrams/Figure 3 System Context.drawio.'

    Replace-Paragraph $doc `
        'Figure 4. PARENT and TEACHER plan capabilities.' `
        'Figure 4. PARENT and TEACHER plan capabilities. Both plans include the chapter game and learner reports. PayOS purchases grant time-limited entitlements; current production prices are administrator-set test values, and one open group is allowed per owner and context. Editable source: Diagrams/Figure 4 Plan Capabilities.drawio.'

    $fe08 = $doc.Content
    $fe08.Find.Text = 'FE-08:'
    $fe08.Find.Forward = $true
    $fe08.Find.Wrap = 0
    if (-not $fe08.Find.Execute()) { throw 'FE-08 not found' }
    $paragraph = $fe08.Paragraphs.Item(1).Range
    $updated = $paragraph.Text.Replace('build version', 'release version')
    if ($updated -eq $paragraph.Text) { throw 'FE-08 does not contain build version' }
    $paragraph.Text = $updated

    $doc.Tables.Item(1).Cell(8,4).Range.Text = 'Aligned Report 1 with the current SRS, BM04 and production; corrected the system-context description, TEACHER capabilities, FE-08 release-version terminology and CH01-CH03 narration coverage. Figures 3 to 5 redrawn.'

    $replacements = @(
        @{ Index = 4; File = 'figure3-context.png' },
        @{ Index = 5; File = 'figure4-plans.png' }
    )
    foreach ($item in $replacements) {
        $shape = $doc.InlineShapes.Item($item.Index)
        $range = $shape.Range.Duplicate
        $width = $shape.Width
        $shape.Delete()
        $newShape = $doc.InlineShapes.AddPicture((Join-Path $Assets $item.File), $false, $true, $range)
        $newShape.LockAspectRatio = -1
        $newShape.Width = $width
    }

    $doc.SaveAs2($Target, 16)
    $doc.Close($false)
}
finally {
    $word.Quit()
}
