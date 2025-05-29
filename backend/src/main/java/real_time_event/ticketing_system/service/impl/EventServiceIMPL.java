package real_time_event.ticketing_system.service.impl;

//Implementation of the EventService interface that manages event operations and ticket transactions in a real-time ticketing system.

import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import real_time_event.ticketing_system.Thread.ThreadManager;
import real_time_event.ticketing_system.dto.EventDTO;
import real_time_event.ticketing_system.entity.Event;
import real_time_event.ticketing_system.entity.enums.EventStatus;
import real_time_event.ticketing_system.repo.EventRepo;
import real_time_event.ticketing_system.service.EventService;
import java.util.Random;
import java.util.NoSuchElementException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.HashMap;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;


@Service
public class EventServiceIMPL implements EventService {

    @Autowired
    private EventRepo eventRepo;                   // Repository for event persistence

    @Autowired
    private ThreadManager threadManager;            // Manages concurrent operations

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // WebSocket messaging

    private final Random random = new Random();

    private void sendTransactionUpdate(String message) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "TRANSACTION");
        payload.put("message", message);

        messagingTemplate.convertAndSend("/topic/event-updates", payload);
    }

    // Add this to your addEvent method
    @Override
    public String addEvent(EventDTO eventDTO) {
        try {
            System.out.println("Processing event in service: " + eventDTO);

            Event event = new Event();
            event.setName(eventDTO.getName());
            event.setTicketReleaseRate(eventDTO.getTicketReleaseRate());
            event.setCustomerRetrievalRate(eventDTO.getCustomerRetrievalRate());
            event.setMaxTicketCapacity(eventDTO.getMaxTicketCapacity());
            event.setTotalTickets(eventDTO.getTotalTickets());
            event.setStatus(EventStatus.CREATED);

            System.out.println("Created Event entity: " + event);

            Event savedEvent = eventRepo.save(event);
            System.out.println("Saved Event: " + savedEvent);
            Map<String, Object> message = new HashMap<>();
            message.put("type", "THREAD_UPDATE");
            message.put("vendorThreads", 2);
            message.put("customerThreads", 3);
            messagingTemplate.convertAndSend("/topic/thread-updates", message);
            return String.valueOf(savedEvent.getId());
        } catch (Exception e) {
            System.err.println("Error in service: " + e.getMessage());
            e.printStackTrace();
            return "Error adding event: " + e.getMessage();
        }
    }

    @Override
    @Transactional
    public synchronized String startEvent(int eventId) {
        try {
            Event event = eventRepo.findById(eventId)
                    .orElseThrow(() -> new NoSuchElementException("Event not found with ID: " + eventId));

            if (event.getStatus() == EventStatus.ACTIVE) {
                return "Event is already running";
            }

            event.setStatus(EventStatus.ACTIVE);
            eventRepo.save(event);
            System.out.println("Updated event status to ACTIVE: " + event.getId());  // Debug log

            threadManager.startEventThreads(eventId, this, event);
            return "Event Started Successfully";
        } catch (NoSuchElementException e) {
            System.err.println("Event not found: " + e.getMessage());  // Debug log
            return "Event not found: " + e.getMessage();
        } catch (Exception e) {
            System.err.println("Error starting event: " + e.getMessage());  // Debug log
            e.printStackTrace();
            return "Error starting event: " + e.getMessage();
        }
    }

    @Override
    @Synchronized
    public String stopEvent(int eventId) {
        try {
            Event event = eventRepo.findById(eventId).get();

            if (event.getStatus() != EventStatus.ACTIVE) {
                return "Event is not running";
            }

            event.setStatus(EventStatus.COMPLETED);
            eventRepo.save(event);

            threadManager.stopAllThreads();
            return "Event Stopped Successfully";
        } catch (NoSuchElementException e) {
            return "Event not found";
        } catch (Exception e) {
            return "Error stopping event: " + e.getMessage();
        }
    }

    public synchronized String addTickets(int eventId) {
        try {
            Event event = eventRepo.findById(eventId).get();

            if (event.getStatus() != EventStatus.ACTIVE) {
                return "Event is not active";
            }

            int maxCapacity = event.getMaxTicketCapacity();
            int currentTotal = event.getTotalTickets();

            // STOP here if max capacity reached
            if (currentTotal >= maxCapacity) {
                // Don't try to add tickets or save to database
                return "Max capacity reached for event";
            }

            int remainingCapacity = maxCapacity - currentTotal;
            int ticketsToAdd = Math.min(random.nextInt(10) + 1, remainingCapacity);

            event.setTotalTickets(currentTotal + ticketsToAdd);
            eventRepo.save(event);  // Only save if we actually add tickets

            return String.format("Added %d tickets (Total: %d/%d)",
                    ticketsToAdd, event.getTotalTickets(), maxCapacity);
        } catch (NoSuchElementException e) {
            return "Event not found";
        } catch (Exception e) {
            return "Error adding tickets: " + e.getMessage();
        }
    }

    public synchronized String removeTickets(int eventId) {
        try {
            Event event = eventRepo.findById(eventId).get();

            if (event.getStatus() != EventStatus.ACTIVE) {
                return "Event is not active";
            }

            if (event.getTotalTickets() <= 0) {
                return "No tickets available";
            }

            event.setTotalTickets(event.getTotalTickets() - 1);
            eventRepo.save(event);

            return String.format("Ticket purchased (Remaining: %d/%d)",
                    event.getTotalTickets(), event.getMaxTicketCapacity());
        } catch (NoSuchElementException e) {
            return "Event not found";
        } catch (Exception e) {
            return "Error removing tickets: " + e.getMessage();
        }
    }
    @Override
    public Event getAvailableTickets(int eventId){
        Event event = eventRepo.findById(eventId).get();
        return event;
    }
}

