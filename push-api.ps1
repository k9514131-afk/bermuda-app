$ErrorActionPreference = "Stop"
Set-Location "c:\Users\Alh16\Downloads\عبووود\Bermuda"

$token = $env:GITHUB_TOKEN  # Set via environment variable, never hardcode tokens
$owner = "Abouda-808-lgtm"; $repo = "studio"; $branch = "main"
$baseUrl = "https://api.github.com/repos/$owner/$repo"
$headers = @{
    "Authorization" = "token $token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "PS-GitPush"
}

Write-Host "[1/6] Getting remote HEAD..."
$refData = (Invoke-WebRequest -Uri "$baseUrl/git/refs/heads/$branch" -Headers $headers -UseBasicParsing).Content | ConvertFrom-Json
$remoteSha = $refData.object.sha
Write-Host "      Remote SHA: $remoteSha"

Write-Host "[2/6] Getting base tree from remote commit..."
$remoteCommit = (Invoke-WebRequest -Uri "$baseUrl/git/commits/$remoteSha" -Headers $headers -UseBasicParsing).Content | ConvertFrom-Json
$baseTreeSha = $remoteCommit.tree.sha
Write-Host "      Base tree: $baseTreeSha"

Write-Host "[3/6] Reading changed files..."
$commitMsg = (git log -1 --format="%s").Trim()
$changedRaw = @(git diff-tree --no-commit-id -r --name-status HEAD)
Write-Host "      Commit: $commitMsg"
Write-Host "      Files : $($changedRaw.Count)"

Write-Host "[4/6] Creating blobs..."
$treeItems = [System.Collections.Generic.List[object]]::new()
foreach ($line in $changedRaw) {
    $parts = $line -split '\t'
    $status = $parts[0].Trim()
    $filePath = $parts[1].Trim()
    $apiPath = $filePath -replace '\\','/'

    if ($status -eq 'D') {
        Write-Host "      DEL $apiPath"
        $treeItems.Add([PSCustomObject]@{ path=$apiPath; mode="100644"; type="blob"; sha=$null })
    } else {
        Write-Host "      UPL $apiPath"
        $fullPath = Join-Path (Get-Location) $filePath
        $bytes = [System.IO.File]::ReadAllBytes($fullPath)
        $b64 = [Convert]::ToBase64String($bytes)

        $blobBody = [ordered]@{ content=$b64; encoding="base64" } | ConvertTo-Json
        $blobResp = Invoke-WebRequest -Uri "$baseUrl/git/blobs" -Method POST -Headers ($headers + @{"Content-Type"="application/json"}) -Body $blobBody -UseBasicParsing
        $blobSha = ($blobResp.Content | ConvertFrom-Json).sha
        Write-Host "          blob sha: $($blobSha.Substring(0,7))"
        $treeItems.Add([PSCustomObject]@{ path=$apiPath; mode="100644"; type="blob"; sha=$blobSha })
    }
}

Write-Host "[5/6] Creating tree and commit..."
$treeBody = [ordered]@{ base_tree=$baseTreeSha; tree=$treeItems.ToArray() } | ConvertTo-Json -Depth 5
$newTreeSha = ((Invoke-WebRequest -Uri "$baseUrl/git/trees" -Method POST -Headers ($headers + @{"Content-Type"="application/json"}) -Body $treeBody -UseBasicParsing).Content | ConvertFrom-Json).sha
Write-Host "      New tree: $($newTreeSha.Substring(0,7))"

$commitBody = [ordered]@{ message=$commitMsg; tree=$newTreeSha; parents=@($remoteSha) } | ConvertTo-Json
$newCommitSha = ((Invoke-WebRequest -Uri "$baseUrl/git/commits" -Method POST -Headers ($headers + @{"Content-Type"="application/json"}) -Body $commitBody -UseBasicParsing).Content | ConvertFrom-Json).sha
Write-Host "      New commit: $($newCommitSha.Substring(0,7))"

Write-Host "[6/6] Updating branch ref..."
$updateBody = [ordered]@{ sha=$newCommitSha; force=$false } | ConvertTo-Json
Invoke-WebRequest -Uri "$baseUrl/git/refs/heads/$branch" -Method PATCH -Headers ($headers + @{"Content-Type"="application/json"}) -Body $updateBody -UseBasicParsing | Out-Null

Write-Host ""
Write-Host "SUCCESS! Pushed commit $($newCommitSha.Substring(0,7)) to github.com/$owner/$repo"
Write-Host "URL: https://github.com/$owner/$repo/commit/$newCommitSha"

# Cleanup
Remove-Item "$PSScriptRoot\push-api.ps1" -Force -ErrorAction SilentlyContinue
