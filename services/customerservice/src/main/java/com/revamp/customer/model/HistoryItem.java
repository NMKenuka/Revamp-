package com.revamp.customer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Service history record for a customer (per vehicle).
 * Note: completedAt is kept as ISO-8601 string for simplicity (e.g., "2025-10-29T12:30:00Z").
 * If you later switch to Instant/LocalDateTime, update controller/repo sorting accordingly.
 */
@Document("history")
public class HistoryItem {
    @Id
    private String id;

    private String customerUserId; // <-- used to query records for the logged-in user
    private String vehicleId;
    private String title;
    private String status;       // OPEN | IN_PROGRESS | DONE | CANCELLED
    private String completedAt;  // ISO-8601 string
    private Double cost;

    public HistoryItem() {}

    public HistoryItem(String id, String customerUserId, String vehicleId, String title, String status, String completedAt, Double cost) {
        this.id = id;
        this.customerUserId = customerUserId;
        this.vehicleId = vehicleId;
        this.title = title;
        this.status = status;
        this.completedAt = completedAt;
        this.cost = cost;
    }

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomerUserId() { return customerUserId; }
    public void setCustomerUserId(String customerUserId) { this.customerUserId = customerUserId; }

    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCompletedAt() { return completedAt; }
    public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }

    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }
}
