package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Defect;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Defect entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DefectRepository extends MongoRepository<Defect, String> {}
