package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Defect;
import com.mycompany.myapp.domain.Inspection;
import com.mycompany.myapp.repository.DefectRepository;
import com.mycompany.myapp.repository.InspectionRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Inspection}.
 */
@RestController
@RequestMapping("/api")
public class InspectionResource {

    private final Logger log = LoggerFactory.getLogger(InspectionResource.class);

    private static final String ENTITY_NAME = "inspection";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InspectionRepository inspectionRepository;

    private final DefectRepository defectRepository;

    public InspectionResource(InspectionRepository inspectionRepository, DefectRepository defectRepository) {
        this.inspectionRepository = inspectionRepository;
        this.defectRepository = defectRepository;
    }

    /**
     * {@code POST  /inspections} : Create a new inspection.
     *
     * @param inspection the inspection to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new inspection, or with status {@code 400 (Bad Request)} if the inspection has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/inspections")
    public ResponseEntity<Inspection> createInspection(@RequestBody Inspection inspection) throws URISyntaxException {
        log.debug("REST request to save Inspection : {}", inspection);
        if (inspection.getId() != null) {
            throw new BadRequestAlertException("A new inspection cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Inspection result = inspectionRepository.save(inspection);
        return ResponseEntity
            .created(new URI("/api/inspections/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /inspections/:id} : Updates an existing inspection.
     *
     * @param id the id of the inspection to save.
     * @param inspection the inspection to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inspection,
     * or with status {@code 400 (Bad Request)} if the inspection is not valid,
     * or with status {@code 500 (Internal Server Error)} if the inspection couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/inspections/{id}")
    public ResponseEntity<Inspection> updateInspection(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Inspection inspection
    ) throws URISyntaxException {
        log.debug("REST request to update Inspection : {}, {}", id, inspection);
        if (inspection.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inspection.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inspectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Inspection result = inspectionRepository.save(inspection);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inspection.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /inspections/:id} : Partial updates given fields of an existing inspection, field will ignore if it is null
     *
     * @param id the id of the inspection to save.
     * @param inspection the inspection to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated inspection,
     * or with status {@code 400 (Bad Request)} if the inspection is not valid,
     * or with status {@code 404 (Not Found)} if the inspection is not found,
     * or with status {@code 500 (Internal Server Error)} if the inspection couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/inspections/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Inspection> partialUpdateInspection(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Inspection inspection
    ) throws URISyntaxException {
        log.debug("REST request to partial update Inspection partially : {}, {}", id, inspection);
        if (inspection.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, inspection.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inspectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Inspection> result = inspectionRepository
            .findById(inspection.getId())
            .map(existingInspection -> {
                if (inspection.getInspectionNr() != null) {
                    existingInspection.setInspectionNr(inspection.getInspectionNr());
                }
                if (inspection.getInspectionStatus() != null) {
                    existingInspection.setInspectionStatus(inspection.getInspectionStatus());
                }
                if (inspection.getStartDateTime() != null) {
                    existingInspection.setStartDateTime(inspection.getStartDateTime());
                }
                if (inspection.getEndDateTime() != null) {
                    existingInspection.setEndDateTime(inspection.getEndDateTime());
                }
                if (inspection.getNote() != null) {
                    existingInspection.setNote(inspection.getNote());
                }
                if (inspection.getHasTenantRefused() != null) {
                    existingInspection.setHasTenantRefused(inspection.getHasTenantRefused());
                }

                return existingInspection;
            })
            .map(inspectionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, inspection.getId())
        );
    }

    /**
     * {@code GET  /inspections} : get all the inspections.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inspections in body.
     */
    @GetMapping("/inspections")
    public List<Inspection> getAllInspections() {
        log.debug("REST request to get all Inspections");
        List<Defect> defects = defectRepository.findAll();
        List<Inspection> inspections = inspectionRepository.findAll();
        defects.forEach(x -> {
            inspections.forEach(y -> {
                if (Objects.equals(x.getInspection().getId(), y.getId())) {
                    y.addDefects(x);
                }
            });
        });
        return inspections;
    }

    /**
     * {@code GET  /inspections/:id} : get the "id" inspection.
     *
     * @param id the id of the inspection to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the inspection, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/inspections/{id}")
    public ResponseEntity<Inspection> getInspection(@PathVariable String id) {
        log.debug("REST request to get Inspection : {}", id);
        Optional<Inspection> inspection = inspectionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(inspection);
    }

    /**
     * {@code DELETE  /inspections/:id} : delete the "id" inspection.
     *
     * @param id the id of the inspection to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/inspections/{id}")
    public ResponseEntity<Void> deleteInspection(@PathVariable String id) {
        log.debug("REST request to delete Inspection : {}", id);
        inspectionRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
