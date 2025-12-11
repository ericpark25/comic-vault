#!/bin/bash

# Simple test script for Comic Vault transfer functionality
# Make sure the backend is running on http://localhost:8080

BASE_URL="http://localhost:8080/api"

echo "========================================="
echo "Comic Vault - Transfer Functionality Test"
echo "========================================="
echo ""

# Step 1: Create two vaults
echo "Step 1: Creating two vaults..."
VAULT1=$(curl -s -X POST "$BASE_URL/vaults" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gotham Vault",
    "location": "123 Wayne Manor",
    "maxCapacity": 100
  }' | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

VAULT2=$(curl -s -X POST "$BASE_URL/vaults" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Metropolis Vault",
    "location": "456 Daily Planet",
    "maxCapacity": 100
  }' | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "✓ Created Vault 1 (ID: $VAULT1) - Gotham Vault"
echo "✓ Created Vault 2 (ID: $VAULT2) - Metropolis Vault"
echo ""

# Step 2: Create a comic
echo "Step 2: Creating a comic..."
COMIC=$(curl -s -X POST "$BASE_URL/comics" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "DC-BAT-001",
    "name": "Batman #1",
    "description": "The first Batman comic"
  }' | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

echo "✓ Created Comic (ID: $COMIC) - Batman #1"
echo ""

# Step 3: Add 50 comics to Vault 1
echo "Step 3: Adding 50 comics to Vault 1..."
curl -s -X POST "$BASE_URL/vaults/$VAULT1/inventory" \
  -H "Content-Type: application/json" \
  -d "{
    \"comicId\": $COMIC,
    \"quantity\": 50
  }" > /dev/null

echo "✓ Added 50 Batman #1 comics to Gotham Vault"
echo ""

# Step 4: Check Vault 1 inventory
echo "Step 4: Checking Vault 1 inventory..."
VAULT1_QTY=$(curl -s "$BASE_URL/vaults/$VAULT1/inventory" | grep -o '"quantity":[0-9]*' | grep -o '[0-9]*')
echo "Vault 1 has $VAULT1_QTY comics"
echo ""

# Step 5: Transfer 20 comics from Vault 1 to Vault 2
echo "Step 5: Transferring 20 comics from Vault 1 to Vault 2..."
TRANSFER_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/inventory/transfer" \
  -H "Content-Type: application/json" \
  -d "{
    \"sourceVaultId\": $VAULT1,
    \"destinationVaultId\": $VAULT2,
    \"comicId\": $COMIC,
    \"quantity\": 20
  }")

HTTP_CODE=$(echo "$TRANSFER_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" == "200" ]; then
    echo "✓ Transfer successful (HTTP 200)"
else
    echo "✗ Transfer failed (HTTP $HTTP_CODE)"
    echo "Response: $(echo "$TRANSFER_RESPONSE" | head -n-1)"
fi
echo ""

# Step 6: Verify final quantities
echo "Step 6: Verifying final quantities..."
VAULT1_FINAL=$(curl -s "$BASE_URL/vaults/$VAULT1/inventory" | grep -o '"quantity":[0-9]*' | grep -o '[0-9]*')
VAULT2_FINAL=$(curl -s "$BASE_URL/vaults/$VAULT2/inventory" | grep -o '"quantity":[0-9]*' | grep -o '[0-9]*')

echo "Vault 1 (Gotham) now has: $VAULT1_FINAL comics (expected: 30)"
echo "Vault 2 (Metropolis) now has: $VAULT2_FINAL comics (expected: 20)"
echo ""

# Verify correctness
if [ "$VAULT1_FINAL" == "30" ] && [ "$VAULT2_FINAL" == "20" ]; then
    echo "========================================="
    echo "✓✓✓ TEST PASSED! ✓✓✓"
    echo "========================================="
else
    echo "========================================="
    echo "✗✗✗ TEST FAILED! ✗✗✗"
    echo "========================================="
fi