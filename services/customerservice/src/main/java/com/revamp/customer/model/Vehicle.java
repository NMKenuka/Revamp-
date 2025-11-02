package com.revamp.customer.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("vehicles")
public class Vehicle {
    @Id
    private String id;

    private String customerUserId;
    private String make;
    private String model;
    private String plateNo;
    private Integer year;

    public Vehicle() {}

    public Vehicle(String id, String customerUserId, String make, String model, String plateNo, Integer year) {
        this.id = id;
        this.customerUserId = customerUserId;
        this.make = make;
        this.model = model;
        this.plateNo = plateNo;
        this.year = year;
    }

    // getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCustomerUserId() { return customerUserId; }
    public void setCustomerUserId(String customerUserId) { this.customerUserId = customerUserId; }
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getPlateNo() { return plateNo; }
    public void setPlateNo(String plateNo) { this.plateNo = plateNo; }
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
}
