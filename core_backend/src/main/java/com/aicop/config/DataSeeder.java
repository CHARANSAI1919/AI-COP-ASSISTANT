package com.aicop.config;

import com.aicop.model.Vehicle;
import com.aicop.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Random;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(VehicleRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                System.out.println("No vehicles found in DB. Seeding initial dataset...");
                
                String[] states = {"KA", "MH", "DL", "TS", "TN", "AP", "WB", "HR", "UP", "GA"};
                String[] owners = {
                    "Rahul Sharma", "Priya Patel", "Arjun Singh", "Sneha Rao", "Ananya Reddy", 
                    "Siddharth Gupta", "Vikram Mehra", "Aditi Deshmukh", "Karan Malhotra", "Ishani Joshi",
                    "Amitabh Bachchan", "Shah Rukh Khan", "Sachin Tendulkar", "Zoya Akhtar", "Vijay Joseph",
                    "Nisha Kumar", "Rohan Das", "Swati Nair", "Deepak Verma", "Pooja Hegde"
                };
                String[] types = {"Four Wheeler", "Two Wheeler", "Heavy Vehicle"};
                String[] models = {
                    "Maruti Suzuki Swift", "Hyundai Creta", "Tata Nexon", "Kia Seltos", "Mahindra Thar",
                    "Honda City", "Toyota Innova", "Royal Enfield Classic 350", "Honda Activa", "Tesla Model 3"
                };
                String[] colors = {"White", "Black", "Silver", "Red", "Blue", "Grey"};
                
                Random rand = new Random();
                
                for (int i = 0; i < 100; i++) {
                    String state = states[rand.nextInt(states.length)];
                    String district = String.format("%02d", rand.nextInt(50) + 1);
                    String series = "" + (char)(rand.nextInt(26) + 'A') + (char)(rand.nextInt(26) + 'A');
                    String number = String.format("%04d", rand.nextInt(9000) + 1000);
                    
                    String plate = state + district + series + number;
                    String owner = owners[rand.nextInt(owners.length)];
                    String type = types[rand.nextInt(types.length)];
                    String model = models[rand.nextInt(models.length)];
                    String color = colors[rand.nextInt(colors.length)];
                    String rcExpiry = (2025 + rand.nextInt(10)) + "-12-31";
                    String insurance = (2024 + rand.nextInt(2)) + "-06-30";
                    int challans = rand.nextInt(5);
                    String status = (challans > 2) ? "Watchlist" : "Active";

                    repository.save(new Vehicle(
                        plate, owner, type, model, color, state, rcExpiry, insurance, challans, status
                    ));
                }
                System.out.println("Seeded 100 vehicle records successfully.");

                // Add a specifically known record for easy testing
                repository.save(new Vehicle(
                    "KA51ML1234", "Adarsh Hegde", "Four Wheeler", "Mahindra XUV700", "Midnight Black",
                    "KA", "2032-05-15", "2025-05-15", 0, "Active"
                ));
            } else {
                System.out.println("Database already contains " + repository.count() + " vehicles. Skipping seed.");
            }
        };
    }
}
