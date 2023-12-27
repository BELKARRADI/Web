package ma.projet.domain;

import static ma.projet.domain.GroupeTestSamples.*;
import static ma.projet.domain.PWTestSamples.*;
import static ma.projet.domain.ProfessorTestSamples.*;
import static ma.projet.domain.StudentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashSet;
import java.util.Set;
import ma.projet.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GroupeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Groupe.class);
        Groupe groupe1 = getGroupeSample1();
        Groupe groupe2 = new Groupe();
        assertThat(groupe1).isNotEqualTo(groupe2);

        groupe2.setId(groupe1.getId());
        assertThat(groupe1).isEqualTo(groupe2);

        groupe2 = getGroupeSample2();
        assertThat(groupe1).isNotEqualTo(groupe2);
    }

    @Test
    void professorTest() throws Exception {
        Groupe groupe = getGroupeRandomSampleGenerator();
        Professor professorBack = getProfessorRandomSampleGenerator();

        groupe.setProfessor(professorBack);
        assertThat(groupe.getProfessor()).isEqualTo(professorBack);

        groupe.professor(null);
        assertThat(groupe.getProfessor()).isNull();
    }

    @Test
    void studentsTest() throws Exception {
        Groupe groupe = getGroupeRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        groupe.addStudents(studentBack);
        assertThat(groupe.getStudents()).containsOnly(studentBack);
        assertThat(studentBack.getGroupe()).isEqualTo(groupe);

        groupe.removeStudents(studentBack);
        assertThat(groupe.getStudents()).doesNotContain(studentBack);
        assertThat(studentBack.getGroupe()).isNull();

        groupe.students(new HashSet<>(Set.of(studentBack)));
        assertThat(groupe.getStudents()).containsOnly(studentBack);
        assertThat(studentBack.getGroupe()).isEqualTo(groupe);

        groupe.setStudents(new HashSet<>());
        assertThat(groupe.getStudents()).doesNotContain(studentBack);
        assertThat(studentBack.getGroupe()).isNull();
    }

    @Test
    void pwTest() throws Exception {
        Groupe groupe = getGroupeRandomSampleGenerator();
        PW pWBack = getPWRandomSampleGenerator();

        groupe.addPw(pWBack);
        assertThat(groupe.getPws()).containsOnly(pWBack);
        assertThat(pWBack.getGroupes()).containsOnly(groupe);

        groupe.removePw(pWBack);
        assertThat(groupe.getPws()).doesNotContain(pWBack);
        assertThat(pWBack.getGroupes()).doesNotContain(groupe);

        groupe.pws(new HashSet<>(Set.of(pWBack)));
        assertThat(groupe.getPws()).containsOnly(pWBack);
        assertThat(pWBack.getGroupes()).containsOnly(groupe);

        groupe.setPws(new HashSet<>());
        assertThat(groupe.getPws()).doesNotContain(pWBack);
        assertThat(pWBack.getGroupes()).doesNotContain(groupe);
    }
}
