package real_time_event.ticketing_system.service;

import real_time_event.ticketing_system.dto.EventDTO;
import real_time_event.ticketing_system.entity.Event;

public interface EventService {
    String addEvent(EventDTO eventDTO);
    String startEvent(int eventId);
    String stopEvent(int eventId);
    String addTickets(int eventId);
    String removeTickets(int eventId);
    Event getAvailableTickets(int eventId);
}
