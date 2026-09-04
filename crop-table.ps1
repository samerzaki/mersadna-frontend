Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\samer\Desktop\mersadna-apps\Frontend\gold-ar.png')
$crop = New-Object System.Drawing.Rectangle(0, 150, 1280, 420)
$bmp = New-Object System.Drawing.Bitmap(1280, 420)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, 1280, 420)), $crop, [System.Drawing.GraphicsUnit]::Pixel)
$bmp.Save('C:\Users\samer\Desktop\mersadna-apps\Frontend\gold-table-crop.png')
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
Write-Output 'done'
