# Test API endpoint untuk melihat orders
Write-Host "Testing GET /api/orders endpoint..." -ForegroundColor Cyan
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method Get -ContentType "application/json"
    
    Write-Host "Success! Total orders: $($response.Count)" -ForegroundColor Green
    Write-Host ""
    
    if ($response.Count -eq 0) {
        Write-Host "No orders found!" -ForegroundColor Yellow
    } else {
        foreach ($order in $response) {
            Write-Host "--- Order: $($order.orderNumber) ---" -ForegroundColor Cyan
            Write-Host "  ID: $($order.id)"
            Write-Host "  Kegiatan: $($order.kegiatan)"
            Write-Host "  Status: $($order.status)"
            Write-Host "  Created By: $($order.createdBy)"
            Write-Host "  Items: $($order.items.Count)"
            Write-Host ""
        }
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure dev server is running on localhost:3000" -ForegroundColor Yellow
}
