package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Defect;
import com.mycompany.myapp.repository.DefectRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Defect}.
 */
@RestController
@RequestMapping("/api")
public class DefectResource {

    private final Logger log = LoggerFactory.getLogger(DefectResource.class);

    private static final String ENTITY_NAME = "defect";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DefectRepository defectRepository;

    public DefectResource(DefectRepository defectRepository) {
        this.defectRepository = defectRepository;
    }

    /**
     * {@code POST  /defects} : Create a new defect.
     *
     * @param defect the defect to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new defect, or with status {@code 400 (Bad Request)} if the defect has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/defects")
    public ResponseEntity<Defect> createDefect(@RequestBody Defect defect) throws URISyntaxException {
        log.debug("REST request to save Defect : {}", defect);
        if (defect.getId() != null) {
            throw new BadRequestAlertException("A new defect cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Defect result = defectRepository.save(defect);
        return ResponseEntity
            .created(new URI("/api/defects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /defects/:id} : Updates an existing defect.
     *
     * @param id the id of the defect to save.
     * @param defect the defect to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated defect,
     * or with status {@code 400 (Bad Request)} if the defect is not valid,
     * or with status {@code 500 (Internal Server Error)} if the defect couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/defects/{id}")
    public ResponseEntity<Defect> updateDefect(@PathVariable(value = "id", required = false) final String id, @RequestBody Defect defect)
        throws URISyntaxException {
        log.debug("REST request to update Defect : {}, {}", id, defect);
        if (defect.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, defect.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!defectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Defect result = defectRepository.save(defect);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, defect.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /defects/:id} : Partial updates given fields of an existing defect, field will ignore if it is null
     *
     * @param id the id of the defect to save.
     * @param defect the defect to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated defect,
     * or with status {@code 400 (Bad Request)} if the defect is not valid,
     * or with status {@code 404 (Not Found)} if the defect is not found,
     * or with status {@code 500 (Internal Server Error)} if the defect couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/defects/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Defect> partialUpdateDefect(
        @PathVariable(value = "id", required = false) final String id,
        @RequestBody Defect defect
    ) throws URISyntaxException {
        log.debug("REST request to partial update Defect partially : {}, {}", id, defect);
        if (defect.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, defect.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!defectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Defect> result = defectRepository
            .findById(defect.getId())
            .map(existingDefect -> {
                if (defect.getDefectNr() != null) {
                    existingDefect.setDefectNr(defect.getDefectNr());
                }
                if (defect.getDeadline() != null) {
                    existingDefect.setDeadline(defect.getDeadline());
                }
                if (defect.getDone() != null) {
                    existingDefect.setDone(defect.getDone());
                }
                if (defect.getImminentDanger() != null) {
                    existingDefect.setImminentDanger(defect.getImminentDanger());
                }
                if (defect.getTitle() != null) {
                    existingDefect.setTitle(defect.getTitle());
                }
                if (defect.getDescription() != null) {
                    existingDefect.setDescription(defect.getDescription());
                }
                if (defect.getSuggestions() != null) {
                    existingDefect.setSuggestions(defect.getSuggestions());
                }

                return existingDefect;
            })
            .map(defectRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, defect.getId()));
    }

    /**
     * {@code GET  /defects} : get all the defects.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of defects in body.
     */
    @GetMapping("/defects")
    public List<Defect> getAllDefects() {
        log.debug("REST request to get all Defects");
        return defectRepository.findAll();
    }

    /**
     * {@code GET  /defects/:id} : get the "id" defect.
     *
     * @param id the id of the defect to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the defect, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/defects/{id}")
    public ResponseEntity<Defect> getDefect(@PathVariable String id) {
        log.debug("REST request to get Defect : {}", id);
        Optional<Defect> defect = defectRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(defect);
    }

    /**
     * {@code DELETE  /defects/:id} : delete the "id" defect.
     *
     * @param id the id of the defect to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/defects/{id}")
    public ResponseEntity<Void> deleteDefect(@PathVariable String id) {
        log.debug("REST request to delete Defect : {}", id);
        defectRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
