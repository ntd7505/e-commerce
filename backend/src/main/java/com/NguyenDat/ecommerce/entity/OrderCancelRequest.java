package com.NguyenDat.ecommerce.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.hibernate.annotations.CreationTimestamp;

import com.NguyenDat.ecommerce.enums.CancelRequestStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "order_cancel_requests")
public class OrderCancelRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cancel_request_id")
    Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by", nullable = false)
    User requestedBy;

    @Column(nullable = false, length = 500)
    String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    CancelRequestStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    User reviewedBy;

    @Column(name = "review_note", length = 500)
    String reviewNote;

    @CreationTimestamp
    @Column(name = "requested_at", updatable = false)
    LocalDateTime requestedAt;

    @Column(name = "reviewed_at")
    LocalDateTime reviewedAt;
}
