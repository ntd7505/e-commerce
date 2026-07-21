package com.nguyendat.ecommerce.service.impl;

import java.util.Collection;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nguyendat.ecommerce.common.exception.AppException;
import com.nguyendat.ecommerce.common.exception.ErrorCode;
import com.nguyendat.ecommerce.entity.InventoryTransaction;
import com.nguyendat.ecommerce.entity.Order;
import com.nguyendat.ecommerce.entity.OrderItem;
import com.nguyendat.ecommerce.entity.ProductVariant;
import com.nguyendat.ecommerce.entity.User;
import com.nguyendat.ecommerce.enums.InventoryTransactionType;
import com.nguyendat.ecommerce.repository.InventoryTransactionRepository;
import com.nguyendat.ecommerce.repository.ProductVariantRepository;
import com.nguyendat.ecommerce.service.InventoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class InventoryServiceImpl implements InventoryService {

    InventoryTransactionRepository inventoryTransactionRepository;
    ProductVariantRepository productVariantRepository;

    @Override
    public void decreaseForOrder(Order order, User changedBy) {
        Map<Long, ProductVariant> lockedVariants = lockOrderVariants(order);
        for (OrderItem item : order.getItems()) {
            ProductVariant variant = lockedVariants.get(item.getProductVariant().getId());
            int beforeQuantity = variant.getStockQuantity();
            int quantity = item.getQuantity();

            if (beforeQuantity < quantity) {
                throw new AppException(ErrorCode.PRODUCT_VARIANT_OUT_OF_STOCK);
            }

            int afterQuantity = beforeQuantity - quantity;
            variant.setStockQuantity(afterQuantity);

            saveTransaction(new TransactionCommand(
                    order,
                    item,
                    variant,
                    changedBy,
                    InventoryTransactionType.SALE,
                    -quantity,
                    beforeQuantity,
                    afterQuantity,
                    "Stock reserved when order created"
            ));
        }
    }

    @Override
    public void restoreForOrder(Order order, User changedBy) {
        Map<Long, ProductVariant> lockedVariants = lockOrderVariants(order);
        for (OrderItem item : order.getItems()) {
            ProductVariant variant = lockedVariants.get(item.getProductVariant().getId());
            int beforeQuantity = variant.getStockQuantity();
            int quantity = item.getQuantity();
            int afterQuantity = beforeQuantity + quantity;

            variant.setStockQuantity(afterQuantity);

            saveTransaction(new TransactionCommand(
                    order,
                    item,
                    variant,
                    changedBy,
                    InventoryTransactionType.RESTOCK,
                    quantity,
                    beforeQuantity,
                    afterQuantity,
                    "Stock restored when order cancelled"
            ));
        }
    }

    private Map<Long, ProductVariant> lockOrderVariants(Order order) {
        Collection<Long> variantIds = order.getItems().stream()
                .map(item -> item.getProductVariant().getId())
                .distinct()
                .sorted()
                .toList();

        Map<Long, ProductVariant> lockedVariants = productVariantRepository.findAllByIdForUpdate(variantIds).stream()
                .collect(Collectors.toMap(ProductVariant::getId, Function.identity()));

        if (lockedVariants.size() != variantIds.size()) {
            throw new AppException(ErrorCode.PRODUCT_VARIANT_NOT_FOUND);
        }
        return lockedVariants;
    }

    private void saveTransaction(TransactionCommand command) {
        InventoryTransaction transaction = new InventoryTransaction();
        transaction.setProductVariant(command.variant());
        transaction.setOrder(command.order());
        transaction.setOrderItem(command.item());
        transaction.setCreatedBy(command.changedBy());
        transaction.setType(command.type());
        transaction.setQuantityChange(command.quantityChange());
        transaction.setBeforeQuantity(command.beforeQuantity());
        transaction.setAfterQuantity(command.afterQuantity());
        transaction.setNote(command.note());

        inventoryTransactionRepository.save(transaction);
    }

    private record TransactionCommand(
            Order order,
            OrderItem item,
            ProductVariant variant,
            User changedBy,
            InventoryTransactionType type,
            int quantityChange,
            int beforeQuantity,
            int afterQuantity,
            String note) {}
}

