# Quick Start Script
# Runs both frontend and backend servers

Write-Host "🚀 Starting AI Content Moderation Application..." -ForegroundColor Cyan
Write-Host ""

# Start Backend in new window
Write-Host "🔧 Starting Python Backend (Flask + ML Models)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\Activate.ps1; python app.py"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host "⚛️  Starting React Frontend (Vite Dev Server)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host ""
Write-Host "✅ Application starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Services:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  First run may take 2-3 minutes to load ML models" -ForegroundColor Magenta
Write-Host ""
