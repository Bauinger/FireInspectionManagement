package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Defect.
 */
@Document(collection = "defect")
public class Defect implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("defect_nr")
    private UUID defectNr;

    @Field("deadline")
    private LocalDate deadline;

    @Field("done")
    private Boolean done;

    @Field("imminent_danger")
    private Boolean imminentDanger;

    @Field("title")
    private String title;

    @Field("description")
    private String description;

    @Field("suggestions")
    private String suggestions;

    @DBRef
    @Field("inspection")
    @JsonIgnoreProperties(value = { "tenant", "appraiser", "defects" }, allowSetters = true)
    private Inspection inspection;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Defect id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UUID getDefectNr() {
        return this.defectNr;
    }

    public Defect defectNr(UUID defectNr) {
        this.setDefectNr(defectNr);
        return this;
    }

    public void setDefectNr(UUID defectNr) {
        this.defectNr = defectNr;
    }

    public LocalDate getDeadline() {
        return this.deadline;
    }

    public Defect deadline(LocalDate deadline) {
        this.setDeadline(deadline);
        return this;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public Boolean getDone() {
        return this.done;
    }

    public Defect done(Boolean done) {
        this.setDone(done);
        return this;
    }

    public void setDone(Boolean done) {
        this.done = done;
    }

    public Boolean getImminentDanger() {
        return this.imminentDanger;
    }

    public Defect imminentDanger(Boolean imminentDanger) {
        this.setImminentDanger(imminentDanger);
        return this;
    }

    public void setImminentDanger(Boolean imminentDanger) {
        this.imminentDanger = imminentDanger;
    }

    public String getTitle() {
        return this.title;
    }

    public Defect title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Defect description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSuggestions() {
        return this.suggestions;
    }

    public Defect suggestions(String suggestions) {
        this.setSuggestions(suggestions);
        return this;
    }

    public void setSuggestions(String suggestions) {
        this.suggestions = suggestions;
    }

    public Inspection getInspection() {
        return this.inspection;
    }

    public void setInspection(Inspection inspection) {
        this.inspection = inspection;
    }

    public Defect inspection(Inspection inspection) {
        this.setInspection(inspection);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Defect)) {
            return false;
        }
        return id != null && id.equals(((Defect) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Defect{" +
            "id=" + getId() +
            ", defectNr='" + getDefectNr() + "'" +
            ", deadline='" + getDeadline() + "'" +
            ", done='" + getDone() + "'" +
            ", imminentDanger='" + getImminentDanger() + "'" +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", suggestions='" + getSuggestions() + "'" +
            "}";
    }
}
