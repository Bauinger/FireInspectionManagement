package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Defect;
import com.mycompany.myapp.repository.DefectRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link DefectResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DefectResourceIT {

    private static final UUID DEFAULT_DEFECT_NR = UUID.randomUUID();
    private static final UUID UPDATED_DEFECT_NR = UUID.randomUUID();

    private static final LocalDate DEFAULT_DEADLINE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DEADLINE = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_DONE = false;
    private static final Boolean UPDATED_DONE = true;

    private static final Boolean DEFAULT_IMMINENT_DANGER = false;
    private static final Boolean UPDATED_IMMINENT_DANGER = true;

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_SUGGESTIONS = "AAAAAAAAAA";
    private static final String UPDATED_SUGGESTIONS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/defects";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private DefectRepository defectRepository;

    @Autowired
    private MockMvc restDefectMockMvc;

    private Defect defect;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Defect createEntity() {
        Defect defect = new Defect()
            .defectNr(DEFAULT_DEFECT_NR)
            .deadline(DEFAULT_DEADLINE)
            .done(DEFAULT_DONE)
            .imminentDanger(DEFAULT_IMMINENT_DANGER)
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .suggestions(DEFAULT_SUGGESTIONS);
        return defect;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Defect createUpdatedEntity() {
        Defect defect = new Defect()
            .defectNr(UPDATED_DEFECT_NR)
            .deadline(UPDATED_DEADLINE)
            .done(UPDATED_DONE)
            .imminentDanger(UPDATED_IMMINENT_DANGER)
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .suggestions(UPDATED_SUGGESTIONS);
        return defect;
    }

    @BeforeEach
    public void initTest() {
        defectRepository.deleteAll();
        defect = createEntity();
    }

    @Test
    void createDefect() throws Exception {
        int databaseSizeBeforeCreate = defectRepository.findAll().size();
        // Create the Defect
        restDefectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(defect)))
            .andExpect(status().isCreated());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeCreate + 1);
        Defect testDefect = defectList.get(defectList.size() - 1);
        assertThat(testDefect.getDefectNr()).isEqualTo(DEFAULT_DEFECT_NR);
        assertThat(testDefect.getDeadline()).isEqualTo(DEFAULT_DEADLINE);
        assertThat(testDefect.getDone()).isEqualTo(DEFAULT_DONE);
        assertThat(testDefect.getImminentDanger()).isEqualTo(DEFAULT_IMMINENT_DANGER);
        assertThat(testDefect.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testDefect.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testDefect.getSuggestions()).isEqualTo(DEFAULT_SUGGESTIONS);
    }

    @Test
    void createDefectWithExistingId() throws Exception {
        // Create the Defect with an existing ID
        defect.setId("existing_id");

        int databaseSizeBeforeCreate = defectRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDefectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(defect)))
            .andExpect(status().isBadRequest());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void getAllDefects() throws Exception {
        // Initialize the database
        defectRepository.save(defect);

        // Get all the defectList
        restDefectMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(defect.getId())))
            .andExpect(jsonPath("$.[*].defectNr").value(hasItem(DEFAULT_DEFECT_NR.toString())))
            .andExpect(jsonPath("$.[*].deadline").value(hasItem(DEFAULT_DEADLINE.toString())))
            .andExpect(jsonPath("$.[*].done").value(hasItem(DEFAULT_DONE.booleanValue())))
            .andExpect(jsonPath("$.[*].imminentDanger").value(hasItem(DEFAULT_IMMINENT_DANGER.booleanValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].suggestions").value(hasItem(DEFAULT_SUGGESTIONS)));
    }

    @Test
    void getDefect() throws Exception {
        // Initialize the database
        defectRepository.save(defect);

        // Get the defect
        restDefectMockMvc
            .perform(get(ENTITY_API_URL_ID, defect.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(defect.getId()))
            .andExpect(jsonPath("$.defectNr").value(DEFAULT_DEFECT_NR.toString()))
            .andExpect(jsonPath("$.deadline").value(DEFAULT_DEADLINE.toString()))
            .andExpect(jsonPath("$.done").value(DEFAULT_DONE.booleanValue()))
            .andExpect(jsonPath("$.imminentDanger").value(DEFAULT_IMMINENT_DANGER.booleanValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.suggestions").value(DEFAULT_SUGGESTIONS));
    }

    @Test
    void getNonExistingDefect() throws Exception {
        // Get the defect
        restDefectMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewDefect() throws Exception {
        // Initialize the database
        defectRepository.save(defect);

        int databaseSizeBeforeUpdate = defectRepository.findAll().size();

        // Update the defect
        Defect updatedDefect = defectRepository.findById(defect.getId()).get();
        updatedDefect
            .defectNr(UPDATED_DEFECT_NR)
            .deadline(UPDATED_DEADLINE)
            .done(UPDATED_DONE)
            .imminentDanger(UPDATED_IMMINENT_DANGER)
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .suggestions(UPDATED_SUGGESTIONS);

        restDefectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDefect.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDefect))
            )
            .andExpect(status().isOk());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
        Defect testDefect = defectList.get(defectList.size() - 1);
        assertThat(testDefect.getDefectNr()).isEqualTo(UPDATED_DEFECT_NR);
        assertThat(testDefect.getDeadline()).isEqualTo(UPDATED_DEADLINE);
        assertThat(testDefect.getDone()).isEqualTo(UPDATED_DONE);
        assertThat(testDefect.getImminentDanger()).isEqualTo(UPDATED_IMMINENT_DANGER);
        assertThat(testDefect.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testDefect.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDefect.getSuggestions()).isEqualTo(UPDATED_SUGGESTIONS);
    }

    @Test
    void putNonExistingDefect() throws Exception {
        int databaseSizeBeforeUpdate = defectRepository.findAll().size();
        defect.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDefectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, defect.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(defect))
            )
            .andExpect(status().isBadRequest());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchDefect() throws Exception {
        int databaseSizeBeforeUpdate = defectRepository.findAll().size();
        defect.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDefectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(defect))
            )
            .andExpect(status().isBadRequest());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamDefect() throws Exception {
        int databaseSizeBeforeUpdate = defectRepository.findAll().size();
        defect.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDefectMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(defect)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateDefectWithPatch() throws Exception {
        // Initialize the database
        defectRepository.save(defect);

        int databaseSizeBeforeUpdate = defectRepository.findAll().size();

        // Update the defect using partial update
        Defect partialUpdatedDefect = new Defect();
        partialUpdatedDefect.setId(defect.getId());

        partialUpdatedDefect.title(UPDATED_TITLE).description(UPDATED_DESCRIPTION).suggestions(UPDATED_SUGGESTIONS);

        restDefectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDefect.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDefect))
            )
            .andExpect(status().isOk());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
        Defect testDefect = defectList.get(defectList.size() - 1);
        assertThat(testDefect.getDefectNr()).isEqualTo(DEFAULT_DEFECT_NR);
        assertThat(testDefect.getDeadline()).isEqualTo(DEFAULT_DEADLINE);
        assertThat(testDefect.getDone()).isEqualTo(DEFAULT_DONE);
        assertThat(testDefect.getImminentDanger()).isEqualTo(DEFAULT_IMMINENT_DANGER);
        assertThat(testDefect.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testDefect.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDefect.getSuggestions()).isEqualTo(UPDATED_SUGGESTIONS);
    }

    @Test
    void fullUpdateDefectWithPatch() throws Exception {
        // Initialize the database
        defectRepository.save(defect);

        int databaseSizeBeforeUpdate = defectRepository.findAll().size();

        // Update the defect using partial update
        Defect partialUpdatedDefect = new Defect();
        partialUpdatedDefect.setId(defect.getId());

        partialUpdatedDefect
            .defectNr(UPDATED_DEFECT_NR)
            .deadline(UPDATED_DEADLINE)
            .done(UPDATED_DONE)
            .imminentDanger(UPDATED_IMMINENT_DANGER)
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .suggestions(UPDATED_SUGGESTIONS);

        restDefectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDefect.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDefect))
            )
            .andExpect(status().isOk());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
        Defect testDefect = defectList.get(defectList.size() - 1);
        assertThat(testDefect.getDefectNr()).isEqualTo(UPDATED_DEFECT_NR);
        assertThat(testDefect.getDeadline()).isEqualTo(UPDATED_DEADLINE);
        assertThat(testDefect.getDone()).isEqualTo(UPDATED_DONE);
        assertThat(testDefect.getImminentDanger()).isEqualTo(UPDATED_IMMINENT_DANGER);
        assertThat(testDefect.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testDefect.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testDefect.getSuggestions()).isEqualTo(UPDATED_SUGGESTIONS);
    }

    @Test
    void patchNonExistingDefect() throws Exception {
        int databaseSizeBeforeUpdate = defectRepository.findAll().size();
        defect.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDefectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, defect.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(defect))
            )
            .andExpect(status().isBadRequest());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchDefect() throws Exception {
        int databaseSizeBeforeUpdate = defectRepository.findAll().size();
        defect.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDefectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(defect))
            )
            .andExpect(status().isBadRequest());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamDefect() throws Exception {
        int databaseSizeBeforeUpdate = defectRepository.findAll().size();
        defect.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDefectMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(defect)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Defect in the database
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteDefect() throws Exception {
        // Initialize the database
        defectRepository.save(defect);

        int databaseSizeBeforeDelete = defectRepository.findAll().size();

        // Delete the defect
        restDefectMockMvc
            .perform(delete(ENTITY_API_URL_ID, defect.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Defect> defectList = defectRepository.findAll();
        assertThat(defectList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
