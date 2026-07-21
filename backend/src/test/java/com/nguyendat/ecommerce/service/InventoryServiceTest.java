package com.nguyendat.ecommerce.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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
import com.nguyendat.ecommerce.service.impl.InventoryServiceImpl;

@ExtendWith(MockitoExtension.class)
class InventoryServiceTest {

    @Mock
    InventoryTransactionRepository inventoryTransactionRepository;

    @Mock
    ProductVariantRepository productVariantRepository;

    @InjectMocks
    InventoryServiceImpl inventoryService;

    Order order;
    ProductVariant variant;
    User changedBy;

    @BeforeEach
    void setUp() {
        variant = new ProductVariant();
        variant.setId(10L);
        variant.setStockQuantity(5);

        OrderItem item = new OrderItem();
        item.setProductVariant(variant);
        item.setQuantity(2);

        order = new Order();
        order.getItems().add(item);
        changedBy = User.builder().id(1L).build();
        lenient()
                .when(productVariantRepository.findAllByIdForUpdate(java.util.List.of(10L)))
                .thenReturn(java.util.List.of(variant));
    }

    @Test
    void decreaseForOrder_shouldDecreaseStockAndSaveSaleTransaction() {
        inventoryService.decreaseForOrder(order, changedBy);

        assertEquals(3, variant.getStockQuantity());
        InventoryTransaction transaction = captureTransaction();
        assertEquals(InventoryTransactionType.SALE, transaction.getType());
        assertEquals(-2, transaction.getQuantityChange());
        assertEquals(5, transaction.getBeforeQuantity());
        assertEquals(3, transaction.getAfterQuantity());
        assertEquals(changedBy, transaction.getCreatedBy());
    }

    @Test
    void decreaseForOrder_shouldRejectInsufficientStock() {
        variant.setStockQuantity(1);

        AppException exception =
                assertThrows(AppException.class, () -> inventoryService.decreaseForOrder(order, changedBy));

        assertEquals(ErrorCode.PRODUCT_VARIANT_OUT_OF_STOCK, exception.getErrorCode());
        verifyNoInteractions(inventoryTransactionRepository);
    }

    @Test
    void restoreForOrder_shouldIncreaseStockAndSaveRestockTransaction() {
        inventoryService.restoreForOrder(order, changedBy);

        assertEquals(7, variant.getStockQuantity());
        InventoryTransaction transaction = captureTransaction();
        assertEquals(InventoryTransactionType.RESTOCK, transaction.getType());
        assertEquals(2, transaction.getQuantityChange());
        assertEquals(5, transaction.getBeforeQuantity());
        assertEquals(7, transaction.getAfterQuantity());
    }

    private InventoryTransaction captureTransaction() {
        ArgumentCaptor<InventoryTransaction> captor = ArgumentCaptor.forClass(InventoryTransaction.class);
        verify(inventoryTransactionRepository).save(captor.capture());
        return captor.getValue();
    }
}

