package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DefectTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Defect.class);
        Defect defect1 = new Defect();
        defect1.setId("id1");
        Defect defect2 = new Defect();
        defect2.setId(defect1.getId());
        assertThat(defect1).isEqualTo(defect2);
        defect2.setId("id2");
        assertThat(defect1).isNotEqualTo(defect2);
        defect1.setId(null);
        assertThat(defect1).isNotEqualTo(defect2);
    }
}
