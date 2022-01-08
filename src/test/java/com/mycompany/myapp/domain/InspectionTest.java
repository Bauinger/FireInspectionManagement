package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InspectionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Inspection.class);
        Inspection inspection1 = new Inspection();
        inspection1.setId("id1");
        Inspection inspection2 = new Inspection();
        inspection2.setId(inspection1.getId());
        assertThat(inspection1).isEqualTo(inspection2);
        inspection2.setId("id2");
        assertThat(inspection1).isNotEqualTo(inspection2);
        inspection1.setId(null);
        assertThat(inspection1).isNotEqualTo(inspection2);
    }
}
