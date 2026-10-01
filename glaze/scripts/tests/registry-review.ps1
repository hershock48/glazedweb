# Registry drift regression through the real CLI entry points, with no network.
# Usage: powershell -File glaze/scripts/tests/registry-review.ps1 (also PowerShell 7).
$ErrorActionPreference='Stop'
$repoRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$fixtureRoot=Join-Path ([IO.Path]::GetTempPath()) ('glaze-registry-'+[guid]::NewGuid())
$archive=Join-Path $fixtureRoot 'archive.json'
$store=Join-Path $fixtureRoot 'studio.json'
$registry=Join-Path $fixtureRoot 'registry.json'
function WriteJson($file,$value){[IO.File]::WriteAllText($file,($value|ConvertTo-Json -Depth 40),[Text.UTF8Encoding]::new($false))}
function Assert($condition,$message){if(!$condition){throw $message}}
function RunCli([string]$script,[string[]]$parameters){
 $output=& node (Join-Path $repoRoot ('glaze/scripts/'+$script+'.mjs')) @parameters --fixture --file $archive --registry-file $registry
 if($LASTEXITCODE -ne 0){throw 'CLI failed: '+$script}
 return ($output -join "`n")
}
try{
 New-Item -ItemType Directory -Path $fixtureRoot|Out-Null
 WriteJson $archive @{version=1;rows=@{}}
 WriteJson ($archive+'.authority.json') @{version=1;mode='studio-local';file='studio.json'}
 WriteJson $store @{revision=1;book=@{version=1;rows=@{fixture=@{name='Registry Fixture';stage='confirmed';events=@();commercial=@{build=1000;monthly=50;monthlyStatus='not-started'};operations=@{sales='won';delivery='building';buildPayment='partial';agreement='signed'};blockers=@()}}}}
 $before=(Get-FileHash -LiteralPath $store).Hash
 $main=@{orders=@{fixture=@{client='Registry Fixture';buildFee=2000;monthly=50;buildFeePaid=$false;live=$false}}}
 WriteJson $registry $main
 $digest=RunCli 'ledger' @('digest','--json')|ConvertFrom-Json
 Assert ($digest.rows[0].flags -contains 'REGISTRY DIFFERS') 'Digest missed changed registry price'
 Assert ($digest.rows[0].registry.build -eq 1000 -and $digest.rows[0].operations.buildPayment -eq 'partial') 'Reader overwrote saved facts'
 $brief=RunCli 'close' @('--all','--json')|ConvertFrom-Json
 Assert ($brief.rows[0].readyForDraft -eq $false -and $brief.rows[0].draft.source -eq 'withheld') 'Conflicting price reached a follow-up draft'
 Assert ($brief.rows[0].registryReview.differences[0].registry -eq 2000) 'Machine-readable difference missing'
 $text=RunCli 'close' @('--all')
 Assert ($text -match 'REGISTRY DIFFERS' -and $text -match 'dashboard=1000, registry=2000' -and $text -match 'Follow-up withheld') 'Human-readable difference missing'
 $main.orders.fixture.buildFee=1000;WriteJson $registry $main
 $clear=RunCli 'close' @('--all','--json')|ConvertFrom-Json
 Assert ($clear.rows[0].readyForDraft -eq $true -and $clear.rows[0].draft.source -eq 'template') 'Matching registry did not allow draft preparation'
 Assert ((Get-FileHash -LiteralPath $store).Hash -eq $before) 'Read-only comparisons changed the ledger'
 Write-Output 'Registry CLI regression passed: digest and close expose drift, withhold uncertain drafts, preserve saved facts, and resume preparation after agreement.'
}finally{
 $resolved=[IO.Path]::GetFullPath($fixtureRoot)
 $tempRoot=[IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\')
 if([IO.Path]::GetDirectoryName($resolved) -ne $tempRoot -or ![IO.Path]::GetFileName($resolved).StartsWith('glaze-registry-')){throw 'Unsafe fixture cleanup path'}
 if(Test-Path -LiteralPath $resolved){Remove-Item -LiteralPath $resolved -Recurse}
}
