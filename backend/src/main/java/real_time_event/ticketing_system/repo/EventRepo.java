package real_time_event.ticketing_system.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;
import real_time_event.ticketing_system.entity.Event;
import real_time_event.ticketing_system.entity.enums.EventStatus;

import java.util.Optional;
//Finds an event by its status.
@Repository
@EnableJpaRepositories
public interface EventRepo extends JpaRepository<Event, Integer> {
    //Finds an event by its status.
    Optional<Event> findByStatus(EventStatus status);
}
