package com.aicop.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vehicles")
public class Vehicle {

    @Id
    private String id;
    private String plate;
    private String owner;
    private String type;
    private String model;
    private String color;
    private String state;
    private String rcExpiry;
    private String insurance;
    private int challanCount;
    private String status;

    public Vehicle() {}

    public Vehicle(String plate, String owner, String type, String model,
                   String color, String state, String rcExpiry,
                   String insurance, int challanCount, String status) {
        this.plate = plate;
        this.owner = owner;
        this.type = type;
        this.model = model;
        this.color = color;
        this.state = state;
        this.rcExpiry = rcExpiry;
        this.insurance = insurance;
        this.challanCount = challanCount;
        this.status = status;
    }

    // ── Getters & Setters ──
    public String getId() { return id; }
    public String getPlate() { return plate; }
    public void setPlate(String plate) { this.plate = plate; }
    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getRcExpiry() { return rcExpiry; }
    public void setRcExpiry(String rcExpiry) { this.rcExpiry = rcExpiry; }
    public String getInsurance() { return insurance; }
    public void setInsurance(String insurance) { this.insurance = insurance; }
    public int getChallanCount() { return challanCount; }
    public void setChallanCount(int challanCount) { this.challanCount = challanCount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
