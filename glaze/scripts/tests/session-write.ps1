# Session CLI regression, no API credentials or customer/provider calls.
# Usage from glazedweb: pwsh -File glaze/scripts/tests/session-write.ps1
# Requires the sibling glazedweb-admin review branch (lib/session-writer.mjs).
$ErrorActionPreference='Stop'
$repoRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$adminRoot=[IO.Path]::GetFullPath((Join-Path $repoRoot '../glazedweb-admin'))
$fixtureRoot=Join-Path ([IO.Path]::GetTempPath()) ('glaze-session-'+[guid]::NewGuid())
$fixtureFile=Join-Path $adminRoot ('data/review-fixture-'+[guid]::NewGuid()+'.json')
$archive=Join-Path $fixtureRoot 'ledger.json'
$pool=Join-Path $fixtureRoot 'pool.json'
$resultFile=Join-Path $fixtureRoot 'research.json'
$realFile=Join-Path $adminRoot 'data/studio.json'
$originalHash=if(Test-Path -LiteralPath $realFile){(Get-FileHash -LiteralPath $realFile -Algorithm SHA256).Hash}else{''}
function WriteJson($file,$value){[IO.File]::WriteAllText($file,($value|ConvertTo-Json -Depth 40),[Text.UTF8Encoding]::new($false))}
function Assert($condition,$message){if(!$condition){throw $message}}
function ReadFixture{Get-Content -LiteralPath $fixtureFile -Raw|ConvertFrom-Json -AsHashtable}
function RunCli([string]$script,[string[]]$parameters){
 $output=& node (Join-Path $repoRoot ('glaze/scripts/'+$script+'.mjs')) @parameters --fixture --file $archive 2>&1
 if($LASTEXITCODE -ne 0){throw ($output -join "`n")}
 return ($output -join "`n")
}
try{
 New-Item -ItemType Directory -Path $fixtureRoot|Out-Null
 $untouched=@{name='Untouched';stage='paid';events=@(@{date='2026-09-01';type='pay';note='Full build payment'});commercial=@{build=500;monthly=50;monthlyStatus='not-started'};next=@{action='Meet';due='2026-09-17';time='10:00';owner='kevin'}}
 WriteJson $archive @{version=1;rows=@{archive=@{name='Old record'}}}
 WriteJson ($archive+'.authority.json') @{version=1;mode='studio-local';file=$fixtureFile}
 WriteJson $fixtureFile @{revision=1;book=@{version=1;rows=@{untouched=$untouched}}}
 $archiveHash=(Get-FileHash -LiteralPath $archive).Hash
 RunCli 'ledger' @('add','fixture','--name','Fixture Bakery','--build','4500','--monthly','195','--channel','visit')|Out-Null
 RunCli 'ledger' @('log','fixture','send','Reviewed proposal sent','--date','2026-09-01')|Out-Null
 RunCli 'ledger' @('log','fixture','reply','Interested in a meeting','--date','2026-09-02')|Out-Null
 RunCli 'ledger' @('log','fixture','meet','Met the owner','--date','2026-09-03')|Out-Null
 RunCli 'ledger' @('log','fixture','pay-part','Deposit received','--date','2026-09-04')|Out-Null
 RunCli 'ledger' @('log','fixture','pay','Balance received','--date','2026-09-05')|Out-Null
 RunCli 'ledger' @('next','fixture','Check billing start','--due','2026-09-18')|Out-Null
 RunCli 'ledger' @('set','fixture','contact=Fixture Owner','channel=warm')|Out-Null
 $saved=ReadFixture
 Assert ($saved.book.rows.fixture.operations.buildPayment -eq 'paid') 'Pay event did not reach operations'
 Assert ($saved.book.rows.fixture.commercial.monthlyStatus -eq 'unknown') 'Build payment started monthly billing'
 Assert ($saved.book.rows.fixture.commercial.build -eq 4500) 'Nested quote was lost'
 Assert ($saved.book.rows.fixture.next.action -eq 'Check billing start') 'Next action did not save'
 Assert ($saved.book.rows.fixture.contact -eq 'Fixture Owner') 'Set did not save'
 $brief=RunCli 'research' @('--slug','fixture','--draft','--json')|ConvertFrom-Json -AsHashtable
 Assert ($brief.runtime -eq 'signed-in-session') 'Research tried to use a provider'
 WriteJson $resultFile @{B=2;D=1;B_evidence=@('https://example.invalid/review');D_evidence=@('https://example.invalid/news');hook='Fixture hook';owner='Fixture Owner';disqualified=$null}
 RunCli 'research' @('--write','fixture','--from',$resultFile)|Out-Null
 $saved=ReadFixture
 $source=$saved.book.rows.fixture.sourceRecords|Where-Object id -eq 'session-prospect'
 Assert (($source.content|ConvertFrom-Json).research.B -eq 2) 'Session research was not preserved'
 WriteJson $pool @{version=1;anchors=@{};candidates=@{'node-1'=@{id='node-1';name='New Fixture Bakery';town='Marshall';kind='bakery';status='new';distanceHome=2;lat=42.27;lon=-84.96;site=@{state='none'}}}}
 RunCli 'select' @('--commit','--pool',$pool,'--n','1','--min','0')|Out-Null
 $saved=ReadFixture
 Assert ($saved.book.rows.Count -eq 3) 'Selector did not add exactly one account'
 $digest=RunCli 'ledger' @('digest','--json')|ConvertFrom-Json -AsHashtable
 $selected=$digest.rows|Where-Object poolId -eq 'node-1'
 Assert ($selected.businessKind -eq 'bakery') 'Selector business kind did not survive projection'
 Assert ($selected.channel -eq 'visit') 'Selector lost sales channel'
 Assert ($selected.scoreAuto -is [long] -or $selected.scoreAuto -is [int]) 'Selector auto score was lost'
 Assert (($saved.book.rows.untouched|ConvertTo-Json -Depth 20 -Compress) -eq ($untouched|ConvertTo-Json -Depth 20 -Compress)) 'Unrelated account changed'
 Assert ((Get-FileHash -LiteralPath $archive).Hash -eq $archiveHash) 'Archived ledger was modified'
 $before=(Get-FileHash -LiteralPath $fixtureFile).Hash
 $errorOutput=& node (Join-Path $repoRoot 'glaze/scripts/ledger.mjs') set fixture build=-2 --fixture --file $archive 2>&1
 Assert ($LASTEXITCODE -eq 1) 'Invalid price was accepted'
 Assert (($errorOutput -join "`n") -match '^ledger:' -and ($errorOutput -join "`n") -notmatch 'at file:') 'Validation printed a stack trace'
 Assert ((Get-FileHash -LiteralPath $fixtureFile).Hash -eq $before) 'Invalid write changed data'
 $defaultMarker=Join-Path $repoRoot '../contracts-private/ledger.json.authority.json'
 if(Test-Path -LiteralPath $defaultMarker){
  $overrideError=& node (Join-Path $repoRoot 'glaze/scripts/ledger.mjs') set fixture name=Wrong --file $archive 2>&1
  Assert ($LASTEXITCODE -eq 1 -and ($overrideError -join "`n") -match 'authority is active') 'Explicit file silently bypassed the authority'
  Assert ((Get-FileHash -LiteralPath $fixtureFile).Hash -eq $before) 'Path override changed data'
 }
 RunCli 'ledger' @('log','fixture','park','Parked for a later date')|Out-Null
 RunCli 'ledger' @('log','fixture','pay','Older receipt recorded later','--date','2026-09-01')|Out-Null
 Assert ((ReadFixture).book.rows.fixture.operations.sales -eq 'parked') 'Old receipt reopened a parked account'
 $copy=Get-Content -LiteralPath $pool -Raw|ConvertFrom-Json -AsHashtable
 $copy.candidates['node-1'].status='new';WriteJson $pool $copy
 $duplicateError=& node (Join-Path $repoRoot 'glaze/scripts/select.mjs') --commit --pool $pool --min 0 --fixture --file $archive 2>&1
 Assert ($LASTEXITCODE -eq 1 -and ($duplicateError -join "`n") -match 'no eligible candidates') 'Selection duplicated an existing pool account'
 Assert ((ReadFixture).book.rows.Count -eq 3) 'Selector created a duplicate'
 Write-Output 'Session CLI regression passed: add, send/reply/meet/payment logs, next, set, no-key research, research write, selector commit, source retention, archive and unrelated-account preservation.'
}finally{
 if(Test-Path -LiteralPath $fixtureFile){Remove-Item -LiteralPath $fixtureFile}
 $resolved=[IO.Path]::GetFullPath($fixtureRoot)
 $tempRoot=[IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\')
 if([IO.Path]::GetDirectoryName($resolved) -ne $tempRoot -or ![IO.Path]::GetFileName($resolved).StartsWith('glaze-session-')){throw 'Unsafe fixture cleanup path'}
 if(Test-Path -LiteralPath $resolved){Remove-Item -LiteralPath $resolved -Recurse}
 if($originalHash){Assert ((Get-FileHash -LiteralPath $realFile -Algorithm SHA256).Hash -eq $originalHash) 'Production ledger changed during fixture tests'}
}
