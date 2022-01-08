package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Inspection;
import com.mycompany.myapp.domain.enumeration.InspectionStatus;
import com.mycompany.myapp.repository.InspectionRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link InspectionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InspectionResourceIT {

    private static final UUID DEFAULT_INSPECTION_NR = UUID.randomUUID();
    private static final UUID UPDATED_INSPECTION_NR = UUID.randomUUID();

    private static final InspectionStatus DEFAULT_INSPECTION_STATUS = InspectionStatus.OPEN;
    private static final InspectionStatus UPDATED_INSPECTION_STATUS = InspectionStatus.DONE;

    private static final Instant DEFAULT_START_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_HAS_TENANT_REFUSED = false;
    private static final Boolean UPDATED_HAS_TENANT_REFUSED = true;

    private static final String ENTITY_API_URL = "/api/inspections";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private InspectionRepository inspectionRepository;

    @Autowired
    private MockMvc restInspectionMockMvc;

    private Inspection inspection;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inspection createEntity() {
        Inspection inspection = new Inspection()
            .inspectionNr(DEFAULT_INSPECTION_NR)
            .inspectionStatus(DEFAULT_INSPECTION_STATUS)
            .startDateTime(DEFAULT_START_DATE_TIME)
            .endDateTime(DEFAULT_END_DATE_TIME)
            .note(DEFAULT_NOTE)
            .hasTenantRefused(DEFAULT_HAS_TENANT_REFUSED);
        return inspection;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Inspection createUpdatedEntity() {
        Inspection inspection = new Inspection()
            .inspectionNr(UPDATED_INSPECTION_NR)
            .inspectionStatus(UPDATED_INSPECTION_STATUS)
            .startDateTime(UPDATED_START_DATE_TIME)
            .endDateTime(UPDATED_END_DATE_TIME)
            .note(UPDATED_NOTE)
            .hasTenantRefused(UPDATED_HAS_TENANT_REFUSED);
        return inspection;
    }

    @BeforeEach
    public void initTest() {
        inspectionRepository.deleteAll();
        inspection = createEntity();
    }

    @Test
    void createInspection() throws Exception {
        int databaseSizeBeforeCreate = inspectionRepository.findAll().size();
        // Create the Inspection
        restInspectionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inspection)))
            .andExpect(status().isCreated());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeCreate + 1);
        Inspection testInspection = inspectionList.get(inspectionList.size() - 1);
        assertThat(testInspection.getInspectionNr()).isEqualTo(DEFAULT_INSPECTION_NR);
        assertThat(testInspection.getInspectionStatus()).isEqualTo(DEFAULT_INSPECTION_STATUS);
        assertThat(testInspection.getStartDateTime()).isEqualTo(DEFAULT_START_DATE_TIME);
        assertThat(testInspection.getEndDateTime()).isEqualTo(DEFAULT_END_DATE_TIME);
        assertThat(testInspection.getNote()).isEqualTo(DEFAULT_NOTE);
        assertThat(testInspection.getHasTenantRefused()).isEqualTo(DEFAULT_HAS_TENANT_REFUSED);
    }

    @Test
    void createInspectionWithExistingId() throws Exception {
        // Create the Inspection with an existing ID
        inspection.setId("existing_id");

        int databaseSizeBeforeCreate = inspectionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInspectionMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inspection)))
            .andExpect(status().isBadRequest());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllInspections() throws Exception {
        // Initialize the database
        inspectionRepository.save(inspection);

        // Get all the inspectionList
        restInspectionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(inspection.getId())))
            .andExpect(jsonPath("$.[*].inspectionNr").value(hasItem(DEFAULT_INSPECTION_NR.toString())))
            .andExpect(jsonPath("$.[*].inspectionStatus").value(hasItem(DEFAULT_INSPECTION_STATUS.toString())))
            .andExpect(jsonPath("$.[*].startDateTime").value(hasItem(DEFAULT_START_DATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].endDateTime").value(hasItem(DEFAULT_END_DATE_TIME.toString())))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)))
            .andExpect(jsonPath("$.[*].hasTenantRefused").value(hasItem(DEFAULT_HAS_TENANT_REFUSED.booleanValue())));
    }

    @Test
    void getInspection() throws Exception {
        // Initialize the database
        inspectionRepository.save(inspection);

        // Get the inspection
        restInspectionMockMvc
            .perform(get(ENTITY_API_URL_ID, inspection.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(inspection.getId()))
            .andExpect(jsonPath("$.inspectionNr").value(DEFAULT_INSPECTION_NR.toString()))
            .andExpect(jsonPath("$.inspectionStatus").value(DEFAULT_INSPECTION_STATUS.toString()))
            .andExpect(jsonPath("$.startDateTime").value(DEFAULT_START_DATE_TIME.toString()))
            .andExpect(jsonPath("$.endDateTime").value(DEFAULT_END_DATE_TIME.toString()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE))
            .andExpect(jsonPath("$.hasTenantRefused").value(DEFAULT_HAS_TENANT_REFUSED.booleanValue()));
    }

    @Test
    void getNonExistingInspection() throws Exception {
        // Get the inspection
        restInspectionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewInspection() throws Exception {
        // Initialize the database
        inspectionRepository.save(inspection);

        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();

        // Update the inspection
        Inspection updatedInspection = inspectionRepository.findById(inspection.getId()).get();
        updatedInspection
            .inspectionNr(UPDATED_INSPECTION_NR)
            .inspectionStatus(UPDATED_INSPECTION_STATUS)
            .startDateTime(UPDATED_START_DATE_TIME)
            .endDateTime(UPDATED_END_DATE_TIME)
            .note(UPDATED_NOTE)
            .hasTenantRefused(UPDATED_HAS_TENANT_REFUSED);

        restInspectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInspection.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInspection))
            )
            .andExpect(status().isOk());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
        Inspection testInspection = inspectionList.get(inspectionList.size() - 1);
        assertThat(testInspection.getInspectionNr()).isEqualTo(UPDATED_INSPECTION_NR);
        assertThat(testInspection.getInspectionStatus()).isEqualTo(UPDATED_INSPECTION_STATUS);
        assertThat(testInspection.getStartDateTime()).isEqualTo(UPDATED_START_DATE_TIME);
        assertThat(testInspection.getEndDateTime()).isEqualTo(UPDATED_END_DATE_TIME);
        assertThat(testInspection.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testInspection.getHasTenantRefused()).isEqualTo(UPDATED_HAS_TENANT_REFUSED);
    }

    @Test
    void putNonExistingInspection() throws Exception {
        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();
        inspection.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInspectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, inspection.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(inspection))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchInspection() throws Exception {
        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();
        inspection.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInspectionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(inspection))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamInspection() throws Exception {
        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();
        inspection.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInspectionMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(inspection)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateInspectionWithPatch() throws Exception {
        // Initialize the database
        inspectionRepository.save(inspection);

        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();

        // Update the inspection using partial update
        Inspection partialUpdatedInspection = new Inspection();
        partialUpdatedInspection.setId(inspection.getId());

        partialUpdatedInspection
            .inspectionNr(UPDATED_INSPECTION_NR)
            .startDateTime(UPDATED_START_DATE_TIME)
            .endDateTime(UPDATED_END_DATE_TIME)
            .note(UPDATED_NOTE)
            .hasTenantRefused(UPDATED_HAS_TENANT_REFUSED);

        restInspectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInspection.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInspection))
            )
            .andExpect(status().isOk());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
        Inspection testInspection = inspectionList.get(inspectionList.size() - 1);
        assertThat(testInspection.getInspectionNr()).isEqualTo(UPDATED_INSPECTION_NR);
        assertThat(testInspection.getInspectionStatus()).isEqualTo(DEFAULT_INSPECTION_STATUS);
        assertThat(testInspection.getStartDateTime()).isEqualTo(UPDATED_START_DATE_TIME);
        assertThat(testInspection.getEndDateTime()).isEqualTo(UPDATED_END_DATE_TIME);
        assertThat(testInspection.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testInspection.getHasTenantRefused()).isEqualTo(UPDATED_HAS_TENANT_REFUSED);
    }

    @Test
    void fullUpdateInspectionWithPatch() throws Exception {
        // Initialize the database
        inspectionRepository.save(inspection);

        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();

        // Update the inspection using partial update
        Inspection partialUpdatedInspection = new Inspection();
        partialUpdatedInspection.setId(inspection.getId());

        partialUpdatedInspection
            .inspectionNr(UPDATED_INSPECTION_NR)
            .inspectionStatus(UPDATED_INSPECTION_STATUS)
            .startDateTime(UPDATED_START_DATE_TIME)
            .endDateTime(UPDATED_END_DATE_TIME)
            .note(UPDATED_NOTE)
            .hasTenantRefused(UPDATED_HAS_TENANT_REFUSED);

        restInspectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInspection.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInspection))
            )
            .andExpect(status().isOk());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
        Inspection testInspection = inspectionList.get(inspectionList.size() - 1);
        assertThat(testInspection.getInspectionNr()).isEqualTo(UPDATED_INSPECTION_NR);
        assertThat(testInspection.getInspectionStatus()).isEqualTo(UPDATED_INSPECTION_STATUS);
        assertThat(testInspection.getStartDateTime()).isEqualTo(UPDATED_START_DATE_TIME);
        assertThat(testInspection.getEndDateTime()).isEqualTo(UPDATED_END_DATE_TIME);
        assertThat(testInspection.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testInspection.getHasTenantRefused()).isEqualTo(UPDATED_HAS_TENANT_REFUSED);
    }

    @Test
    void patchNonExistingInspection() throws Exception {
        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();
        inspection.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInspectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, inspection.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(inspection))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchInspection() throws Exception {
        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();
        inspection.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInspectionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(inspection))
            )
            .andExpect(status().isBadRequest());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamInspection() throws Exception {
        int databaseSizeBeforeUpdate = inspectionRepository.findAll().size();
        inspection.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInspectionMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(inspection))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Inspection in the database
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteInspection() throws Exception {
        // Initialize the database
        inspectionRepository.save(inspection);

        int databaseSizeBeforeDelete = inspectionRepository.findAll().size();

        // Delete the inspection
        restInspectionMockMvc
            .perform(delete(ENTITY_API_URL_ID, inspection.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Inspection> inspectionList = inspectionRepository.findAll();
        assertThat(inspectionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
