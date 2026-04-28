package com.aicop.service;

import com.aicop.model.Vehicle;
import com.aicop.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    /**
     * Finds a vehicle by its plate number.
     * In a real-world scenario, this could also call an external Parivahan API
     * if the vehicle is not found in our local cache (MongoDB).
     */
    public Optional<Vehicle> getVehicleDetails(String plate) {
        // Clean plate number (remove spaces/dashes and uppercase)
        String cleanPlate = plate.replaceAll("[\\s-]", "").toUpperCase();
        
        Optional<Vehicle> vehicle = vehicleRepository.findByPlate(cleanPlate);
        
        if (vehicle.isPresent()) {
            return vehicle;
        }

        // Potential Extension: If not found in local DB, call Parivahan API Wrapper
        // return callExternalParivahanApi(cleanPlate);
        
        return Optional.empty();
    }
}
