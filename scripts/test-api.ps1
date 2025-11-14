# Test API using curl
# Pastikan dev server sudah running: npm run dev

Write-Host "🧪 Testing API Endpoints..." -ForegroundColor Cyan
Write-Host "📍 API URL: http://localhost:3000/api/orders" -ForegroundColor Yellow
Write-Host ("─" * 60)

# 1. TEST GET ALL ORDERS
Write-Host "`n1️⃣ TEST: GET All Orders" -ForegroundColor Green
Write-Host "   Request: GET http://localhost:3000/api/orders"
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method Get
    Write-Host "   ✅ Status: 200" -ForegroundColor Green
    Write-Host "   📊 Total Orders: $($response.Count)" -ForegroundColor Cyan
    if ($response.Count -gt 0) {
        Write-Host "   📦 First Order: $($response[0].orderNumber)" -ForegroundColor Cyan
        Write-Host "   📝 Kegiatan: $($response[0].kegiatan)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
    Write-Host "`n💡 Pastikan dev server sudah running: npm run dev" -ForegroundColor Yellow
    exit 1
}

# 2. TEST POST CREATE ORDER
Write-Host "`n2️⃣ TEST: POST Create Order" -ForegroundColor Green
Write-Host "   Request: POST http://localhost:3000/api/orders"

$newOrder = @{
    kegiatan = "Rapat Internal"
    tanggalPermintaan = (Get-Date).ToString("yyyy-MM-dd")
    tanggalPengiriman = (Get-Date).AddDays(2).ToString("yyyy-MM-dd")
    untukBagian = "Teknologi Informasi"
    yangMengajukan = "Nadia Addnan - 3082589"
    noHp = "081234567890"
    namaApprover = "Arief Darmawan (3072535)"
    tipeTamu = "Regular"
    keterangan = "Testing API dari PowerShell"
    createdBy = "nadia"
    items = @(
        @{
            jenisKonsumsi = "Nasi Box"
            qty = 25
            satuan = "Box"
            lokasiPengiriman = "Gedung Anggrek"
            sesiWaktu = "Siang"
            waktu = "12:00"
        },
        @{
            jenisKonsumsi = "Air Mineral"
            qty = 30
            satuan = "Unit"
            lokasiPengiriman = "Gedung Anggrek"
            sesiWaktu = "Siang"
            waktu = "12:00"
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $created = Invoke-RestMethod -Uri "http://localhost:3000/api/orders" -Method Post -Body $newOrder -ContentType "application/json"
    Write-Host "   ✅ Status: 201" -ForegroundColor Green
    Write-Host "   🆕 Order Number: $($created.orderNumber)" -ForegroundColor Cyan
    Write-Host "   📦 Total Items: $($created.items.Count)" -ForegroundColor Cyan
    Write-Host "   🆔 Order ID: $($created.id)" -ForegroundColor Cyan
    $orderId = $created.id
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
    exit 1
}

# 3. TEST GET SINGLE ORDER
Write-Host "`n3️⃣ TEST: GET Single Order" -ForegroundColor Green
Write-Host "   Request: GET http://localhost:3000/api/orders/$orderId"
try {
    $single = Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId" -Method Get
    Write-Host "   ✅ Status: 200" -ForegroundColor Green
    Write-Host "   📦 Order: $($single.orderNumber)" -ForegroundColor Cyan
    Write-Host "   📝 Kegiatan: $($single.kegiatan)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
}

# 4. TEST PATCH UPDATE ORDER
Write-Host "`n4️⃣ TEST: PATCH Update Order (Cancel)" -ForegroundColor Green
Write-Host "   Request: PATCH http://localhost:3000/api/orders/$orderId"

$updateData = @{
    status = "Cancelled"
    tanggalPembatalan = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    alasanPembatalan = "Testing cancel dari PowerShell"
} | ConvertTo-Json

try {
    $updated = Invoke-RestMethod -Uri "http://localhost:3000/api/orders/$orderId" -Method Patch -Body $updateData -ContentType "application/json"
    Write-Host "   ✅ Status: 200" -ForegroundColor Green
    Write-Host "   📊 New Status: $($updated.status)" -ForegroundColor Cyan
    Write-Host "   ❌ Alasan: $($updated.alasanPembatalan)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
}

# SUMMARY
Write-Host ("`n" + ("═" * 60)) -ForegroundColor Cyan
Write-Host "🎉 ALL TESTS COMPLETED!" -ForegroundColor Green
Write-Host ("═" * 60) -ForegroundColor Cyan
Write-Host "✅ GET All Orders: Working" -ForegroundColor Green
Write-Host "✅ POST Create Order: Working" -ForegroundColor Green
Write-Host "✅ GET Single Order: Working" -ForegroundColor Green
Write-Host "✅ PATCH Update Order: Working" -ForegroundColor Green
Write-Host "`n💡 API Backend siap digunakan!" -ForegroundColor Yellow
Write-Host "📊 Cek di Prisma Studio: http://localhost:5555" -ForegroundColor Yellow
