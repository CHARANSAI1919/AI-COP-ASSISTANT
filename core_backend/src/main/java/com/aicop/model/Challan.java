package com.aicop.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "challans")
public class Challan {

    @Id
    private String id;
    private String challanId;
    private String vehicle;
    private String owner;
    private String violation;
    private double amount;
    private String datetime;
    private String location;
    private String officer;
    private String dueDate;
    private String status; // UNPAID / PAID

    public Challan() {}

    // ── Getters & Setters ──
    public String getId() { return id; }
    public String getChallanId() { return challanId; }
    public void setChallanId(String challanId) { this.challanId = challanId; }
    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public String getViolation() { return violation; }
    public void setViolation(String violation) { this.violation = violation; }
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    public String getDatetime() { return datetime; }
    public void setDatetime(String datetime) { this.datetime = datetime; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getOfficer() { return officer; }
    public void setOfficer(String officer) { this.officer = officer; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
