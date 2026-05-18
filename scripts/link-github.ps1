# Связывает проект с GitHub: авторизация, создание репозитория, push.
# Запуск: .\scripts\link-github.ps1

$ErrorActionPreference = "Stop"
$repoName = "test_case_nceu"
$githubUser = "erik0002"

Set-Location $PSScriptRoot\..

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "Установка GitHub CLI..."
  winget install GitHub.cli --accept-source-agreements --accept-package-agreements -e
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
}

$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
  Write-Host "`nВойдите в GitHub (откроется браузер)..."
  gh auth login --hostname github.com --git-protocol https --web --scopes "repo,read:org"
}

$user = try { (gh api user --jq .login).Trim() } catch { $githubUser }
if (-not $user) { $user = $githubUser }
Write-Host "GitHub: $user"

$remoteUrl = "https://github.com/$user/$repoName.git"
if (git remote get-url origin 2>$null) {
  git remote set-url origin $remoteUrl
} else {
  git remote add origin $remoteUrl
}

$exists = gh repo view "$user/$repoName" 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Создание репозитория $user/$repoName ..."
  gh repo create $repoName --public --source=. --remote=origin --description "SPA Task Manager — React 19, TypeScript, RTK Query"
} else {
  Write-Host "Репозиторий уже существует: https://github.com/$user/$repoName"
}

git push -u origin main
Write-Host "`nГотово: https://github.com/$user/$repoName"
