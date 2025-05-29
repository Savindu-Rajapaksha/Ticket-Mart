package real_time_event.ticketing_system.controller;

/**
 * REST Controller for handling event-related operations
 */

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import real_time_event.ticketing_system.dto.EventDTO;
import real_time_event.ticketing_system.service.EventService;

@RestController
@RequestMapping("/api/v1/event")
@CrossOrigin //(origins = "http://localhost:3000", allowCredentials = "true")
public class EventController {

    @Autowired
    private EventService eventService;


    //Creates a new event
    @PostMapping(path = "/add")
    public ResponseEntity<String> addEvent(@RequestBody EventDTO eventDTO) {
        try {
            System.out.println("Received event DTO: " + eventDTO); // Debug log
            String result = eventService.addEvent(eventDTO);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            System.err.println("Error in controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    //Starts an existing event
    @GetMapping(path = "/start/{eventId}")
    public ResponseEntity<String> startEvent(@PathVariable int eventId) {
        try {
            System.out.println("Starting event"); // Debug log
            eventService.startEvent(eventId);
            return ResponseEntity.ok("Event started");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //Test endpoint for ticket addition
    @GetMapping(path = "/ticket_add")
    public String ticketAddEvent() {
        return "Event ticket added";
    }

    //Test endpoint for ticket removal
    @GetMapping(path = "/ticket_remove")
    public String ticketRemoveEvent() {
        return "Event ticket removed";
    }

    //Stops a running event
    @GetMapping(path = "/stop/{eventId}")
    public String stopEvent(@PathVariable int eventId) {
        eventService.stopEvent(eventId);
        return "Event stopped";
    }
}
