# FinCity Deck -- PowerPoint COM Automation
$ErrorActionPreference = 'Stop'
$OUTPUT = "C:\Users\salvatore.mangano\Desktop\FinCity\presentation\FinCity_Deck.pptx"

function Ole([string]$h) {
    $r=[Convert]::ToInt32($h.Substring(0,2),16)
    $g=[Convert]::ToInt32($h.Substring(2,2),16)
    $b=[Convert]::ToInt32($h.Substring(4,2),16)
    return $r+($g*256)+($b*65536)
}
function Pt([double]$i) { return $i*72 }

$PURPLE   = Ole 'A100FF'
$DARK_BG  = Ole '08080F'
$DARK_CIRC1 = Ole '1A072C'  # PURPLE 12% on DARK_BG
$DARK_CIRC2 = Ole '1F0733'  # PURPLE 15% on DARK_BG
$DARK_CIRC3 = Ole '170727'  # PURPLE 10% on DARK_BG
$DARK_S   = Ole '12122A'
$CARD_D   = Ole '100020'
$WHITE    = Ole 'FFFFFF'
$OFFWHITE = Ole 'F8F8F8'
$TEXT_D   = Ole '111111'
$TEXT_M   = Ole '555555'
$TEXT_DIM = Ole '888888'
$TEXT_L   = Ole 'DDDDDD'
$AMETHYST = Ole 'CC88FF'
$TEAL     = Ole '00D4A3'
$BORDER_P = Ole 'E0BBFF'
$LINE_D   = Ole '3A0070'

function Add-Rect($sl,$x,$y,$w,$h,$fill,$lc=$null,$lw=1.0) {
    $s=$sl.Shapes.AddShape(1,(Pt $x),(Pt $y),(Pt $w),(Pt $h))
    $s.Fill.ForeColor.RGB=$fill; $s.Fill.Solid()
    if($lc){$s.Line.Visible=-1;$s.Line.ForeColor.RGB=$lc;$s.Line.Weight=$lw}
    else{$s.Line.Visible=0}
    return $s
}
function Add-Oval($sl,$x,$y,$d,$fill,$lc=$null,$lw=1.5) {
    $s=$sl.Shapes.AddShape(9,(Pt $x),(Pt $y),(Pt $d),(Pt $d))
    $s.Fill.ForeColor.RGB=$fill;$s.Fill.Solid()
    if($lc){$s.Line.Visible=-1;$s.Line.ForeColor.RGB=$lc;$s.Line.Weight=$lw}
    else{$s.Line.Visible=0}
    return $s
}
function Add-RRect($sl,$x,$y,$w,$h,$fill,$lc=$null,$lw=1.2) {
    $s=$sl.Shapes.AddShape(5,(Pt $x),(Pt $y),(Pt $w),(Pt $h))
    $s.Fill.ForeColor.RGB=$fill;$s.Fill.Solid()
    try{$s.Adjustments.Item(1)=0.15}catch{}
    if($lc){$s.Line.Visible=-1;$s.Line.ForeColor.RGB=$lc;$s.Line.Weight=$lw}
    else{$s.Line.Visible=0}
    return $s
}
function TxtOn($s,$text,$sz,$clr,$bold=$false,$face='Calibri',$align=1) {
    $tf=$s.TextFrame;$tf.AutoSize=0;$tf.WordWrap=-1
    $tf.MarginLeft=0;$tf.MarginRight=0;$tf.MarginTop=0;$tf.MarginBottom=0
    $tf.VerticalAnchor=3
    $tr=$tf.TextRange;$tr.Text=$text;$tr.Font.Size=$sz
    $tr.Font.Bold=if($bold){-1}else{0}
    $tr.Font.Color.RGB=$clr;$tr.Font.Name=$face
    $tr.ParagraphFormat.Alignment=$align
}
function Add-TB($sl,$x,$y,$w,$h,$text,$sz,$clr,$bold=$false,$face='Calibri',$align=1) {
    $s=$sl.Shapes.AddTextbox(1,(Pt $x),(Pt $y),(Pt $w),(Pt $h))
    $s.TextFrame.AutoSize=0;$s.TextFrame.WordWrap=-1
    $s.TextFrame.MarginLeft=0;$s.TextFrame.MarginRight=0
    $s.TextFrame.MarginTop=0;$s.TextFrame.MarginBottom=0
    $tr=$s.TextFrame.TextRange;$tr.Text=$text;$tr.Font.Size=$sz
    $tr.Font.Bold=if($bold){-1}else{0}
    $tr.Font.Color.RGB=$clr;$tr.Font.Name=$face
    $tr.ParagraphFormat.Alignment=$align
    return $s
}
function Set-Dark($sl){$sl.Background.Fill.Visible=-1;$sl.Background.Fill.ForeColor.RGB=$DARK_BG;$sl.Background.Fill.Solid()}
function Set-Light($sl){$sl.Background.Fill.Visible=-1;$sl.Background.Fill.ForeColor.RGB=$OFFWHITE;$sl.Background.Fill.Solid()}
function Lbl($sl,$t,$x,$y){$null=Add-TB $sl $x $y 9 0.28 $t 10 $PURPLE $true 'Calibri' 1}
function NS{return $pres.Slides.Add($pres.Slides.Count+1,12)}

Write-Host "Starting PowerPoint..."
$ppt=New-Object -ComObject PowerPoint.Application
$ppt.Visible=-1; $ppt.WindowState=2
$pres=$ppt.Presentations.Add(0)
$pres.PageSetup.SlideWidth=Pt 10
$pres.PageSetup.SlideHeight=Pt 5.625

# =========================================================
# SLIDE 1 - COVER (dark)
# =========================================================
Write-Host "Slide 1 (Cover)..."
$s1=NS; Set-Dark $s1
$null=Add-Oval $s1 7.0 -0.8 4.5 $DARK_CIRC1
$null=Add-Oval $s1 7.5  3.5 3.0 $DARK_CIRC2
$null=Add-Oval $s1 0.0  4.5 2.0 $DARK_CIRC3

$b1=Add-Rect $s1 8.15 0.27 1.65 0.36 $PURPLE
TxtOn $b1 "ACCENTURE" 9 $WHITE $true 'Calibri' 2

Lbl $s1 "AI HACKATHON 2026  -  EDUCAZIONE FINANZIARIA" 0.5 0.80

$oc=Add-Oval $s1 0.48 1.10 0.75 (Ole '2A0060') (Ole 'A100FF')
TxtOn $oc "FC" 22 $PURPLE $true 'Cambria' 2

$null=Add-TB $s1 1.42 1.05 7.5 1.45 "FinCity" 72 $WHITE $true 'Cambria' 1
$null=Add-TB $s1 0.50 2.70 7.5 0.85 "Costruisci il tuo futuro finanziario, un mese alla volta." 18 $TEXT_L $false 'Calibri' 1

$pillsD=@(@("City Builder",0.5),@("Claude AI Coach",2.75),@("Agentic Coding",5.0))
foreach($pd in $pillsD){
    $pr=Add-RRect $s1 $pd[1] 3.65 2.1 0.38 $DARK_S $PURPLE 1.2
    TxtOn $pr $pd[0] 11 $AMETHYST $true 'Calibri' 2
}
$null=Add-TB $s1 0.5 5.18 9 0.28 "Salvatore Mangano  -  Accenture" 10 (Ole '444444') $false 'Calibri' 1

# =========================================================
# SLIDE 2 - IL PROBLEMA (light)
# =========================================================
Write-Host "Slide 2 (Problema)..."
$s2=NS; Set-Light $s2

Lbl $s2 "IL PROBLEMA" 0.5 0.28
$null=Add-TB $s2 0.5 0.62 9 1.10 "L'Italia ha un problema`ndi alfabetizzazione finanziaria." 34 $TEXT_D $true 'Cambria' 1
$null=Add-TB $s2 0.5 1.78 9 0.38 "Corsi e libri non bastano. Serve un approccio esperienziale, concreto, coinvolgente." 14 $TEXT_M $false 'Calibri' 1

$stats=@(
    @("37 su 39","Posizione OCSE","L'Italia e' al 37 posto su 39 Paesi OCSE per alfabetizzazione finanziaria adulta (OCSE 2023)"),
    @("58%","degli italiani","Non ha un fondo emergenza adeguato pari a 3 mesi di spese correnti"),
    @("76%","degli italiani","Non ha mai investito i propri risparmi in strumenti a lungo termine (ETF, fondi)")
)
for($i=0;$i -lt 3;$i++){
    $cx=0.48+$i*3.15
    $null=Add-Rect $s2 $cx 2.28 2.97 2.92 $DARK_BG
    $null=Add-TB   $s2 ($cx+0.15) 2.40 2.7 1.00 $stats[$i][0] 44 $PURPLE   $true  'Cambria' 1
    $null=Add-TB   $s2 ($cx+0.15) 3.44 2.7 0.30 $stats[$i][1] 11 $AMETHYST $true  'Calibri' 1
    $null=Add-TB   $s2 ($cx+0.15) 3.80 2.7 1.25 $stats[$i][2] 11 $TEXT_DIM $false 'Calibri' 1
}
$null=Add-TB $s2 0.5 5.30 9 0.22 "Fonte: OCSE PISA Financial Literacy 2023, Banca d'Italia 2024" 9 (Ole 'AAAAAA') $false 'Calibri' 1

# =========================================================
# SLIDE 3 - LA SOLUZIONE (dark)
# =========================================================
Write-Host "Slide 3 (Soluzione)..."
$s3=NS; Set-Dark $s3
$null=Add-Oval $s3 7.5 3.5 3.5 $DARK_CIRC1

Lbl $s3 "LA SOLUZIONE" 0.5 0.28
$null=Add-TB $s3 0.5 0.62 5.3 0.75 "Imparare giocando." 36 $WHITE $true 'Cambria' 1

$feats=@(
    @("[City]","City Builder Finanziario","Ogni edificio = una scelta reale. Risparmio,`ninvestimento, protezione dagli imprevisti."),
    @("[AI]","Coach AI - Claude","Spiega ogni decisione in modo semplice e contestuale.`nTono mai giudicante."),
    @("[EV]","Scenari Realistici","Guasti, bonus, crolli di mercato: la vita finanziaria`nsimulata in ambiente sicuro.")
)
for($i=0;$i -lt 3;$i++){
    $fy=1.58+$i*1.12
    $oc2=Add-Oval $s3 0.45 $fy 0.52 (Ole '2A0060') $PURPLE 1.0
    TxtOn $oc2 $feats[$i][0] 8 $AMETHYST $true 'Calibri' 2
    $null=Add-TB $s3 1.10 ($fy+0.02) 4.4 0.34 $feats[$i][1] 14 $WHITE $true  'Calibri' 1
    $null=Add-TB $s3 1.10 ($fy+0.38) 4.4 0.62 $feats[$i][2] 12 $TEXT_DIM $false 'Calibri' 1
}

$null=Add-Rect $s3 5.82 0.72 3.92 4.30 (Ole '0D1117') (Ole '1E2D45') 1.0
$null=Add-TB   $s3 5.97 0.80 3.60 0.30 "FinCity - Gen 2025 | Score: 72/100" 10 (Ole '94A3B8') $false 'Calibri' 1

$tiles=@("Casa","Lavoro","Banca","Fondo Em.","ETF","Formaz.","Qualita'","+ Altro")
$placed=@($true,$true,$true,$true,$true,$false,$false,$false)
for($i=0;$i -lt 8;$i++){
    $col=$i%4;$row=[Math]::Floor($i/4)
    $bx=5.97+$col*0.88;$by=1.22+$row*0.93
    $fc2=if($placed[$i]){Ole '1A2235'}else{Ole '111827'}
    $lc2=if($placed[$i]){$TEAL}else{Ole '1E2D45'}
    $null=Add-Rect $s3 $bx $by 0.80 0.80 $fc2 $lc2 1.0
    $null=Add-TB   $s3 $bx ($by+0.22) 0.80 0.40 $tiles[$i] 7 $WHITE $false 'Calibri' 2
}

$null=Add-Rect $s3 5.97 3.14 3.60 0.34 (Ole '111827') (Ole '1E2D45') 1.0
$null=Add-TB   $s3 5.97 3.14 3.60 0.34 "Risp. 3.250  |  Em. 2.400  |  Inv. 5.100  |  Deb. 0" 9 $TEAL $false 'Calibri' 2

$null=Add-Rect $s3 5.97 3.58 3.60 1.38 (Ole '180030') (Ole '5000A0') 1.0
$null=Add-TB   $s3 6.07 3.65 3.40 0.28 "Coach AI (Claude)" 10 $AMETHYST $true 'Calibri' 1
$null=Add-TB   $s3 6.07 3.95 3.40 0.90 "Hai fatto il primo investimento! 200 EU/mese per 10 anni al 7% diventano circa 34.000 EU. La pazienza e' il superpotere dell'investitore." 10 $TEXT_L $false 'Calibri' 1

# =========================================================
# SLIDE 4 - STRUTTURA AGENTICA (light)
# =========================================================
Write-Host "Slide 4 (Agentic)..."
$s4=NS; Set-Light $s4

Lbl $s4 "STRUTTURA AGENTICA" 0.5 0.28
$null=Add-TB $s4 0.5 0.62 9 0.92 "Sviluppato con Claude Code e Agentic Coding." 28 $TEXT_D $true 'Cambria' 1

$skills=@(
    @("1","financial-scenario-generator",   "Genera eventi finanziari realistici con impatti calcolati e messaggi educativi incorporati."),
    @("2","financial-coach",               "Feedback personalizzato in base allo stato del giocatore. Mock offline o Claude API reale."),
    @("3","evaluate-player-decision",      "Analizza ogni scelta: impatto immediato, proiezione 12 mesi e 5 anni, score 0-100."),
    @("4","game-content-creator",          "Genera tutti i testi di gioco seguendo linee guida di accessibilita' linguistica.")
)
for($i=0;$i -lt 4;$i++){
    $col=$i%2;$row=[Math]::Floor($i/2)
    $cx=0.45+$col*4.80;$cy=1.72+$row*1.60
    $null=Add-Rect $s4 $cx $cy 4.55 1.42 $OFFWHITE $BORDER_P 1.0
    $oc3=Add-Oval $s4 ($cx+0.12) ($cy+0.12) 0.42 $PURPLE
    TxtOn $oc3 $skills[$i][0] 14 $WHITE $true 'Calibri' 2
    $null=Add-TB $s4 ($cx+0.65) ($cy+0.10) 3.75 0.52 $skills[$i][1] 12 $TEXT_D $true  'Courier New' 1
    $null=Add-TB $s4 ($cx+0.65) ($cy+0.68) 3.75 0.68 $skills[$i][2] 11 $TEXT_M $false 'Calibri'     1
}

$wfItems=@("Turno mensile","Scenario Gen.","Decisione player","Evaluate","Coach AI")
$wfClrs=@($DARK_BG,$PURPLE,$DARK_BG,$PURPLE,$PURPLE)
for($i=0;$i -lt 5;$i++){
    $wx=0.45+$i*1.85
    $wb=Add-Rect $s4 $wx 4.88 1.60 0.40 $wfClrs[$i]
    TxtOn $wb $wfItems[$i] 9 $WHITE $true 'Calibri' 2
    if($i -lt 4){$null=Add-TB $s4 ($wx+1.60) 4.88 0.25 0.40 ">" 14 $PURPLE $true 'Calibri' 2}
}

# =========================================================
# SLIDE 5 - IMPATTO & CLOSING (dark)
# =========================================================
Write-Host "Slide 5 (Closing)..."
$s5=NS; Set-Dark $s5
$null=Add-Oval $s5 7.0 -0.5 4.2 $DARK_CIRC1
$null=Add-Oval $s5 7.5  3.5 3.0 $DARK_CIRC2

Lbl $s5 "IMPATTO E NEXT STEPS" 0.5 0.28
$null=Add-TB $s5 0.5 0.62 5.8 1.45 "Un gioco.`nUn cambiamento reale." 38 $WHITE $true 'Cambria' 1

$imps=@(
    @("120","Mesi simulati`nin 10 anni"),
    @("7+","Concetti finanziari`ninsegnati"),
    @("0","Dipendenze`nesterne"),
    @("1","Funzione per`nattivare Claude")
)
for($i=0;$i -lt 4;$i++){
    $ix=0.45+$i*2.35
    $null=Add-Rect $s5 $ix 2.30 2.15 1.70 $CARD_D $LINE_D 1.0
    $null=Add-TB   $s5 $ix 2.38 2.15 0.85 $imps[$i][0] 48 $PURPLE   $true  'Cambria' 2
    $null=Add-TB   $s5 $ix 3.28 2.15 0.65 $imps[$i][1] 11 $TEXT_DIM $false 'Calibri' 2
}

$cta=Add-Rect $s5 0.45 4.22 5.65 0.75 $PURPLE
TxtOn $cta "Prova ora  -  apri app/index.html nel browser" 15 $WHITE $true 'Calibri' 2

$null=Add-TB $s5 6.40 0.65 3.30 0.35 "Next steps" 13 $AMETHYST $true 'Calibri' 1
$ns2=@("App mobile + notifiche mensili","Integrazione dati bancari reali","Curriculum per scuole superiori","Versione multilingua")
for($i=0;$i -lt 4;$i++){$null=Add-TB $s5 6.40 (1.10+$i*0.58) 3.30 0.50 $ns2[$i] 13 $TEXT_DIM $false 'Calibri' 1}
$null=Add-TB $s5 0.5 5.22 9 0.25 "Accenture  -  AI Hackathon 2026" 10 (Ole '444444') $true 'Calibri' 3

# =========================================================
# Save & close
# =========================================================
Write-Host "Saving: $OUTPUT"
if(Test-Path $OUTPUT){Remove-Item $OUTPUT -Force}
$pres.SaveAs($OUTPUT,24)
$pres.Close()
$ppt.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($pres)|Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt)|Out-Null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
Write-Host "Done -> $OUTPUT"
