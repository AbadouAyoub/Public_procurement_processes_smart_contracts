# Quick Setup Script for ProcurementSystem Testing

Write-Host "`n*** PROCUREMENT SYSTEM - QUICK SETUP GUIDE ***`n" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Gray

# Check Node.js
Write-Host "`nStep 1: Checking Prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   [OK] Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   [ERROR] Node.js not found! Please install from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "   [OK] npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   [ERROR] npm not found!" -ForegroundColor Red
    exit 1
}

# Initialize npm project
Write-Host "`nStep 2: Initializing npm project..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    npm init -y
    Write-Host "   [OK] package.json created" -ForegroundColor Green
} else {
    Write-Host "   [INFO] package.json already exists" -ForegroundColor Cyan
}

# Install dependencies
Write-Host "`nStep 3: Installing dependencies..." -ForegroundColor Yellow
Write-Host "   This may take a few minutes...`n" -ForegroundColor Gray

$dependencies = @(
    "hardhat",
    "@openzeppelin/contracts",
    "@nomicfoundation/hardhat-toolbox",
    "@nomicfoundation/hardhat-chai-matchers",
    "@nomicfoundation/hardhat-network-helpers",
    "chai",
    "ethers",
    "hardhat-gas-reporter"
)

foreach ($dep in $dependencies) {
    Write-Host "   Installing $dep..." -ForegroundColor Gray
    npm install --save-dev $dep 2>&1 | Out-Null
}

Write-Host "`n   [OK] All dependencies installed!" -ForegroundColor Green

# Initialize Hardhat if needed
Write-Host "`nStep 4: Checking Hardhat configuration..." -ForegroundColor Yellow
if (-not (Test-Path "hardhat.config.js")) {
    Write-Host "   Please run: npx hardhat init" -ForegroundColor Cyan
    Write-Host "   Choose: Create a JavaScript project" -ForegroundColor Cyan
} else {
    Write-Host "   [OK] hardhat.config.js found" -ForegroundColor Green
}

# Compile contracts
Write-Host "`nStep 5: Compiling contracts..." -ForegroundColor Yellow
try {
    npx hardhat compile
    Write-Host "   [OK] Contracts compiled successfully!" -ForegroundColor Green
} catch {
    Write-Host "   [WARNING] Compilation failed. Check for errors above." -ForegroundColor Red
}

# Summary
Write-Host "`n" + ("=" * 70) -ForegroundColor Gray
Write-Host "*** SETUP COMPLETE! ***" -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Gray

Write-Host "`nNEXT STEPS:" -ForegroundColor Yellow
Write-Host "   [1] Start local blockchain:" -ForegroundColor White
Write-Host "      npx hardhat node" -ForegroundColor Gray
Write-Host "`n   [2] In a new terminal, deploy contract:" -ForegroundColor White
Write-Host "      npx hardhat run scripts/deploy.js --network localhost" -ForegroundColor Gray
Write-Host "`n   [3] Run tests:" -ForegroundColor White
Write-Host "      npx hardhat test" -ForegroundColor Gray
Write-Host "`n   [4] Run vulnerability tests:" -ForegroundColor White
Write-Host "      npx hardhat test test/VulnerabilityTests.test.js" -ForegroundColor Gray
Write-Host "`n   [5] View gas report:" -ForegroundColor White
Write-Host "      `$env:REPORT_GAS=`"true`"; npx hardhat test" -ForegroundColor Gray

Write-Host "`nDOCUMENTATION:" -ForegroundColor Yellow
Write-Host "   - Testing Guide: TESTING_GUIDE.md" -ForegroundColor Gray
Write-Host "   - Contract Docs: contracts/README.md" -ForegroundColor Gray
Write-Host "   - Architecture: ProjectGLD2026.md" -ForegroundColor Gray

Write-Host "`nGood luck with your project!" -ForegroundColor Green
Write-Host ""
