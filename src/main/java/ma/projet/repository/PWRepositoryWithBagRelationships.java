package ma.projet.repository;

import java.util.List;
import java.util.Optional;
import ma.projet.domain.PW;
import org.springframework.data.domain.Page;

public interface PWRepositoryWithBagRelationships {
    Optional<PW> fetchBagRelationships(Optional<PW> pW);

    List<PW> fetchBagRelationships(List<PW> pWS);

    Page<PW> fetchBagRelationships(Page<PW> pWS);
}
