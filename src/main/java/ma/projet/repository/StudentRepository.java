package ma.projet.repository;

import java.util.List;
import java.util.Optional;
import ma.projet.domain.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Student entity.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    default Optional<Student> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Student> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Student> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select student from Student student left join fetch student.user left join fetch student.groupe",
        countQuery = "select count(student) from Student student"
    )
    Page<Student> findAllWithToOneRelationships(Pageable pageable);

    @Query("select student from Student student left join fetch student.user left join fetch student.groupe")
    List<Student> findAllWithToOneRelationships();

    @Query("select student from Student student left join fetch student.user left join fetch student.groupe where student.id =:id")
    Optional<Student> findOneWithToOneRelationships(@Param("id") Long id);

    @Query("select student from Student student where student.id =:id")
    Student getStudentsById(@Param("id") Long id);
}
