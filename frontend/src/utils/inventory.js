/**
 * Calculate total quantity from inventory items
 */
export function calculateTotalQuantity(inventories) {
    if (!inventories || !Array.isArray(inventories)) return 0;
    return inventories.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Calculate capacity percentage
 */
export function calculateCapacityPercentage(currentCount, maxCapacity) {
    if (!maxCapacity || maxCapacity === 0) return 0;
    return (currentCount / maxCapacity) * 100;
}
