package com.NguyenDat.ecommerce.service.impl;

import org.springframework.stereotype.Service;

import com.NguyenDat.ecommerce.common.exception.AppException;
import com.NguyenDat.ecommerce.common.exception.ErrorCode;
import com.NguyenDat.ecommerce.entity.InventoryTransaction;
import com.NguyenDat.ecommerce.entity.Order;
import com.NguyenDat.ecommerce.entity.OrderItem;
import com.NguyenDat.ecommerce.entity.ProductVariant;
import com.NguyenDat.ecommerce.entity.User;
import com.NguyenDat.ecommerce.enums.InventoryTransactionType;
import com.NguyenDat.ecommerce.repository.InventoryTransactionRepository;
import com.NguyenDat.ecommerce.service.InventoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryServiceImpl implements InventoryService {

    InventoryTransactionRepository inventoryTransactionRepository;

    @Override
    public void decreaseForOrder(Order order, User changedBy) {
        for (OrderItem item : order.getItems()) {
            ProductVariant variant = item.getProductVariant();
            int beforeQuantity = variant.getStockQuantity();
            int quantity = item.getQuantity();

            if (beforeQuantity < quantity) {
                throw new AppException(ErrorCode.PRODUCT_VARIANT_OUT_OF_STOCK);
            }

            int afterQuantity = beforeQuantity - quantity;
            variant.setStockQuantity(afterQuantity);

            saveTransaction(
                    order,
                    item,
                    variant,
                    changedBy,
                    InventoryTransactionType.SALE,
                    -quantity,
                    beforeQuantity,
                    afterQuantity,
                    "Stock decreased when order confirmed");
        }
    }

    @Override
    public void restoreForOrder(Order order, User changedBy) {
        for (OrderItem item : order.getItems()) {
            ProductVariant variant = item.getProductVariant();
            int beforeQuantity = variant.getStockQuantity();
            int quantity = item.getQuantity();
            int afterQuantity = beforeQuantity + quantity;

            variant.setStockQuantity(afterQuantity);

            saveTransaction(
                    order,
                    item,
                    variant,
                    changedBy,
                    InventoryTransactionType.RESTOCK,
                    quantity,
                    beforeQuantity,
                    afterQuantity,
                    "Stock restored when order cancelled");
        }
    }

    private void saveTransaction(
            Order order,
            OrderItem item,
            ProductVariant variant,
            User changedBy,
            InventoryTransactionType type,
            int quantityChange,
            int beforeQuantity,
            int afterQuantity,
            String note) {
        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setProductVariant(variant);
        transaction.setOrder(order);
        transaction.setOrderItem(item);
        transaction.setCreatedBy(changedBy);
        transaction.setType(type);
        transaction.setQuantityChange(quantityChange);
        transaction.setBeforeQuantity(beforeQuantity);
        transaction.setAfterQuantity(afterQuantity);
        transaction.setNote(note);

        inventoryTransactionRepository.save(transaction);
    }
}
