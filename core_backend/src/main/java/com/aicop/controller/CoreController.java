package com.aicop.controller;

import com.aicop.model.Challan;
import com.aicop.model.Vehicle;
import com.aicop.repository.ChallanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.aicop.service.VehicleService;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class CoreController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private ChallanRepository challanRepository;

    @Value("${nlp.service.url:http://localhost:5000}")
    private String nlpServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/vehicles/{plate}")
    public ResponseEntity<Vehicle> getVehicleByPlate(@PathVariable String plate) {
        Optional<Vehicle> vehicle = vehicleService.getVehicleDetails(plate);
        return vehicle.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/challans")
    public ResponseEntity<List<Challan>> getAllChallans() {
        return ResponseEntity.ok(challanRepository.findAll());
    }

    @PostMapping("/challans/{id}/pay")
    public ResponseEntity<?> payChallan(@PathVariable String id) {
        Optional<Challan> challanOpt = challanRepository.findById(id);
        if (challanOpt.isPresent()) {
            Challan challan = challanOpt.get();
            challan.setStatus("PAID");
            return ResponseEntity.ok(challanRepository.save(challan));
        } else {
            // Fallback if frontend sends challanId instead of MongoDB id
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/command")
    @SuppressWarnings("unchecked")
    public ResponseEntity<?> processCommand(@RequestBody CommandRequest request) {
        try {
            // Forward natural language command to Python NLP Service
            String url = nlpServiceUrl + "/parse-command";
            ResponseEntity<Map> nlpResponse = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> result = nlpResponse.getBody();
            
            if (result == null) return ResponseEntity.badRequest().body("NLP Service returned empty response");

            String intent = (String) result.get("intent");
            
            if ("check_vehicle".equals(intent) || "issue_challan".equals(intent)) {
                String plate = (String) result.get("plate");
                Optional<Vehicle> vOpt = vehicleService.getVehicleDetails(plate);
                
                // If not found in DB, we still allow issuing a challan to a "new" vehicle
                Vehicle vehicle = vOpt.orElse(createDummyVehicle(plate));
                result.put("vehicle", vehicle);

                if ("issue_challan".equals(intent)) {
                    Map<String, Object> challanSuggestion = (Map<String, Object>) result.get("challan_suggestion");
                    if (challanSuggestion != null) {
                        Challan challan = new Challan();
                        challan.setChallanId((String) challanSuggestion.get("id"));
                        challan.setVehicle(vehicle.getPlate());
                        challan.setOwner(vehicle.getOwner());
                        challan.setViolation((String) challanSuggestion.get("violation"));
                        challan.setAmount(Double.parseDouble(challanSuggestion.get("amount").toString()));
                        challan.setDatetime((String) challanSuggestion.get("datetime"));
                        challan.setLocation((String) challanSuggestion.get("location"));
                        challan.setOfficer("Officer Sharma (COP001)"); // Simulated logged-in officer
                        challan.setDueDate((String) challanSuggestion.get("dueDate"));
                        challan.setStatus("UNPAID");
                        
                        // Save directly to MongoDB
                        challan = challanRepository.save(challan);
                        result.put("challan", challan);
                    }
                }
            }

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Error communicating with NLP service", "details", e.getMessage()));
        }
    }

    private Vehicle createDummyVehicle(String plate) {
        return new Vehicle(
            plate,
            "Unknown Owner",
            "Unknown Type",
            "Unknown Model",
            "Unknown Color",
            "Unknown State",
            "N/A",
            "N/A",
            0,
            "Not Found"
        );
    }
}
