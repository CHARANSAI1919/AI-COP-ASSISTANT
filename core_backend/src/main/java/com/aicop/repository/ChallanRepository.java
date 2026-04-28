package com.aicop.repository;

import com.aicop.model.Challan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallanRepository extends MongoRepository<Challan, String> {
    List<Challan> findByVehicle(String plate);
}
