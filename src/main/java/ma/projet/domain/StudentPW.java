package ma.projet.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * A StudentPW.
 */
@Entity
@Table(name = "student_pw")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentPW implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "time")
    private String time;

    @Lob
    @Column(name = "image_front")
    private byte[] imageFront;

    @Column(name = "image_front_content_type")
    private String imageFrontContentType;

    @Lob
    @Column(name = "image_side")
    private byte[] imageSide;

    @Column(name = "image_side_content_type")
    private String imageSideContentType;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "mesure_angle_1")
    private String mesureAngle1;

    @Column(name = "mesure_angle_2")
    private String mesureAngle2;

    @Column(name = "intersection")
    private String intersection;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user", "groupe" }, allowSetters = true)
    private Student student;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "tooth", "groupes" }, allowSetters = true)
    private PW pw;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudentPW id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTime() {
        return this.time;
    }

    public StudentPW time(String time) {
        this.setTime(time);
        return this;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public byte[] getImageFront() {
        return this.imageFront;
    }

    public StudentPW imageFront(byte[] imageFront) {
        this.setImageFront(imageFront);
        return this;
    }

    public void setImageFront(byte[] imageFront) {
        this.imageFront = imageFront;
    }

    public String getImageFrontContentType() {
        return this.imageFrontContentType;
    }

    public StudentPW imageFrontContentType(String imageFrontContentType) {
        this.imageFrontContentType = imageFrontContentType;
        return this;
    }

    public void setImageFrontContentType(String imageFrontContentType) {
        this.imageFrontContentType = imageFrontContentType;
    }

    public byte[] getImageSide() {
        return this.imageSide;
    }

    public StudentPW imageSide(byte[] imageSide) {
        this.setImageSide(imageSide);
        return this;
    }

    public void setImageSide(byte[] imageSide) {
        this.imageSide = imageSide;
    }

    public String getImageSideContentType() {
        return this.imageSideContentType;
    }

    public StudentPW imageSideContentType(String imageSideContentType) {
        this.imageSideContentType = imageSideContentType;
        return this;
    }

    public void setImageSideContentType(String imageSideContentType) {
        this.imageSideContentType = imageSideContentType;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public StudentPW date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getMesureAngle1() {
        return this.mesureAngle1;
    }

    public StudentPW mesureAngle1(String mesureAngle1) {
        this.setMesureAngle1(mesureAngle1);
        return this;
    }

    public void setMesureAngle1(String mesureAngle1) {
        this.mesureAngle1 = mesureAngle1;
    }

    public String getMesureAngle2() {
        return this.mesureAngle2;
    }

    public StudentPW mesureAngle2(String mesureAngle2) {
        this.setMesureAngle2(mesureAngle2);
        return this;
    }

    public void setMesureAngle2(String mesureAngle2) {
        this.mesureAngle2 = mesureAngle2;
    }

    public String getIntersection() {
        return this.intersection;
    }

    public StudentPW intersection(String intersection) {
        this.setIntersection(intersection);
        return this;
    }

    public void setIntersection(String intersection) {
        this.intersection = intersection;
    }

    public Student getStudent() {
        return this.student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public StudentPW student(Student student) {
        this.setStudent(student);
        return this;
    }

    public PW getPw() {
        return this.pw;
    }

    public void setPw(PW pW) {
        this.pw = pW;
    }

    public StudentPW pw(PW pW) {
        this.setPw(pW);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentPW)) {
            return false;
        }
        return getId() != null && getId().equals(((StudentPW) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentPW{" +
            "id=" + getId() +
            ", time='" + getTime() + "'" +
            ", imageFront='" + getImageFront() + "'" +
            ", imageFrontContentType='" + getImageFrontContentType() + "'" +
            ", imageSide='" + getImageSide() + "'" +
            ", imageSideContentType='" + getImageSideContentType() + "'" +
            ", date='" + getDate() + "'" +
            ", mesureAngle1='" + getMesureAngle1() + "'" +
            ", mesureAngle2='" + getMesureAngle2() + "'" +
            ", intersection='" + getIntersection() + "'" +
            "}";
    }
}
