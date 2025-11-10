# Setup Script for AI Content Moderation
# Run this script to set up the Python backend

Write-Host "🚀 Setting up AI-Powered Content Moderation Backend..." -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location -Path "backend"

# Check Python installation
Write-Host "📋 Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version
    Write-Host "✅ Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found! Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host ""
Write-Host "🔨 Creating virtual environment..." -ForegroundColor Yellow
python -m venv venv

# Activate virtual environment
Write-Host "⚡ Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Upgrade pip
Write-Host ""
Write-Host "📦 Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Install dependencies
Write-Host ""
Write-Host "📥 Installing Python packages (this may take 5-10 minutes)..." -ForegroundColor Yellow
Write-Host "   - Flask (web framework)" -ForegroundColor Gray
Write-Host "   - Transformers (Hugging Face NLP)" -ForegroundColor Gray
Write-Host "   - PyTorch (deep learning)" -ForegroundColor Gray
Write-Host "   - OpenCV (computer vision)" -ForegroundColor Gray
Write-Host ""

pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Backend setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📚 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Keep this terminal open" -ForegroundColor White
    Write-Host "   2. Run: python app.py" -ForegroundColor Yellow
    Write-Host "   3. Open another terminal for frontend" -ForegroundColor White
    Write-Host "   4. Run: npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "⚠️  Note: First run will download ML models (~2-3GB)" -ForegroundColor Magenta
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Installation failed! Check error messages above." -ForegroundColor Red
    exit 1
}
