package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.InspectionStatus;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Inspection.
 */
@Document(collection = "inspection")
public class Inspection implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("inspection_nr")
    private UUID inspectionNr;

    @Field("inspection_status")
    private InspectionStatus inspectionStatus;

    @Field("start_date_time")
    private Instant startDateTime;

    @Field("end_date_time")
    private Instant endDateTime;

    @Field("title")
    private String title;

    @Field("note")
    private String note;

    @Field("has_tenant_refused")
    private Boolean hasTenantRefused;

    @DBRef
    @Field("tenant")
    private Customer tenant;

    @DBRef
    @Field("appraiser")
    private User appraiser;

    @DBRef
    @Field("defects")
    @JsonIgnoreProperties(value = { "inspection" }, allowSetters = true)
    private Set<Defect> defects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Inspection id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public UUID getInspectionNr() {
        return this.inspectionNr;
    }

    public Inspection inspectionNr(UUID inspectionNr) {
        this.setInspectionNr(inspectionNr);
        return this;
    }

    public void setInspectionNr(UUID inspectionNr) {
        this.inspectionNr = inspectionNr;
    }

    public InspectionStatus getInspectionStatus() {
        return this.inspectionStatus;
    }

    public Inspection inspectionStatus(InspectionStatus inspectionStatus) {
        this.setInspectionStatus(inspectionStatus);
        return this;
    }

    public void setInspectionStatus(InspectionStatus inspectionStatus) {
        this.inspectionStatus = inspectionStatus;
    }

    public Instant getStartDateTime() {
        return this.startDateTime;
    }

    public Inspection startDateTime(Instant startDateTime) {
        this.setStartDateTime(startDateTime);
        return this;
    }

    public void setStartDateTime(Instant startDateTime) {
        this.startDateTime = startDateTime;
    }

    public Instant getEndDateTime() {
        return this.endDateTime;
    }

    public Inspection endDateTime(Instant endDateTime) {
        this.setEndDateTime(endDateTime);
        return this;
    }

    public void setEndDateTime(Instant endDateTime) {
        this.endDateTime = endDateTime;
    }

    public String getNote() {
        return this.note;
    }

    public Inspection note(String note) {
        this.setNote(note);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTitle() {
        return this.title;
    }

    public Inspection title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Boolean getHasTenantRefused() {
        return this.hasTenantRefused;
    }

    public Inspection hasTenantRefused(Boolean hasTenantRefused) {
        this.setHasTenantRefused(hasTenantRefused);
        return this;
    }

    public void setHasTenantRefused(Boolean hasTenantRefused) {
        this.hasTenantRefused = hasTenantRefused;
    }

    public Customer getTenant() {
        return this.tenant;
    }

    public void setTenant(Customer customer) {
        this.tenant = customer;
    }

    public Inspection tenant(Customer customer) {
        this.setTenant(customer);
        return this;
    }

    public User getAppraiser() {
        return this.appraiser;
    }

    public void setAppraiser(User user) {
        this.appraiser = user;
    }

    public Inspection appraiser(User user) {
        this.setAppraiser(user);
        return this;
    }

    public Set<Defect> getDefects() {
        return this.defects;
    }

    public void setDefects(Set<Defect> defects) {
        if (this.defects != null) {
            this.defects.forEach(i -> i.setInspection(null));
        }
        if (defects != null) {
            defects.forEach(i -> i.setInspection(this));
        }
        this.defects = defects;
    }

    public Inspection defects(Set<Defect> defects) {
        this.setDefects(defects);
        return this;
    }

    public Inspection addDefects(Defect defect) {
        this.defects.add(defect);
        defect.setInspection(this);
        return this;
    }

    public Inspection removeDefects(Defect defect) {
        this.defects.remove(defect);
        defect.setInspection(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Inspection)) {
            return false;
        }
        return id != null && id.equals(((Inspection) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Inspection{" +
            "id=" + getId() +
            ", inspectionNr='" + getInspectionNr() + "'" +
            ", inspectionStatus='" + getInspectionStatus() + "'" +
            ", startDateTime='" + getStartDateTime() + "'" +
            ", endDateTime='" + getEndDateTime() + "'" +
            ", note='" + getNote() + "'" +
            ", title='" + getTitle() + "'" +
            ", hasTenantRefused='" + getHasTenantRefused() + "'" +
            "}";
    }
}
