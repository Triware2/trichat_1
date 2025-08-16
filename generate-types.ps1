# PowerShell script to generate TypeScript types for Supabase
# Run this script from the stellar-cx-nexus directory

Write-Host "🔧 Generating TypeScript types for Supabase..." -ForegroundColor Green

# Check if config.toml exists
if (Test-Path "supabase/config.toml") {
    Write-Host "✅ Found supabase/config.toml" -ForegroundColor Green
    
    # Extract project ID from config.toml
    $configContent = Get-Content "supabase/config.toml" -Raw
    if ($configContent -match 'project_id = "([^"]*)"') {
        $projectId = $matches[1]
        Write-Host "📋 Project ID: $projectId" -ForegroundColor Cyan
        
        # Generate types
        Write-Host "🔄 Generating types..." -ForegroundColor Yellow
        npx supabase gen types typescript --project-id $projectId > src/types/supabase.ts
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ TypeScript types generated successfully!" -ForegroundColor Green
            Write-Host "📁 Types saved to: src/types/supabase.ts" -ForegroundColor Cyan
            Write-Host "🚀 You can now enable database operations in the permissions system." -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to generate types. Please check your Supabase project ID." -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Could not find project_id in config.toml" -ForegroundColor Red
        Write-Host "💡 Please manually run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ supabase/config.toml not found" -ForegroundColor Red
    Write-Host "💡 Please manually run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts" -ForegroundColor Yellow
}

Write-Host "`n📝 Note: After generating types, you can enable database operations by uncommenting the database code in useAccessManagement.ts" -ForegroundColor Blue 