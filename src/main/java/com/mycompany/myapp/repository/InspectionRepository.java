package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Inspection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Inspection entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InspectionRepository extends MongoRepository<Inspection, String> {}
