Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('C:\Users\samer\Desktop\mersadna-apps\Frontend\gold-table-crop.png')
$bmp = New-Object System.Drawing.Bitmap($img)
function IsDark($c) { return ($c.R + $c.G + $c.B) -lt 300 }
function BandEdges($y0, $y1, $x0, $x1) {
  $minX = $x1; $maxX = $x0
  for ($y = $y0; $y -lt $y1; $y++) {
    for ($x = $x0; $x -lt $x1; $x++) {
      $p = $bmp.GetPixel($x, $y)
      if (IsDark $p) { if ($x -lt $minX) { $minX = $x }; if ($x -gt $maxX) { $maxX = $x } }
    }
  }
  return "$minX..$maxX"
}
# header band vs first two value rows, per column x-region (full 1280 width crop)
Write-Output 'sell col header : BandEdges(48, 80, 560, 780)'
Write-Output (BandEdges 48 80 560 780)
Write-Output 'sell col row1   : BandEdges(95, 135, 560, 780)'
Write-Output (BandEdges 95 135 560 780)
Write-Output 'buy col header  : BandEdges(48, 80, 380, 560)'
Write-Output (BandEdges 48 80 380 560)
Write-Output 'buy col row1    : BandEdges(95, 135, 380, 560)'
Write-Output (BandEdges 95 135 380 560)
Write-Output 'chg col header  : BandEdges(48, 80, 180, 330)'
Write-Output (BandEdges 48 80 180 330)
Write-Output 'chg col row1    : BandEdges(95, 135, 180, 330)'
Write-Output (BandEdges 95 135 180 330)
$bmp.Dispose()
$img.Dispose()
