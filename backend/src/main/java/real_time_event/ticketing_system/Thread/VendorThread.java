package real_time_event.ticketing_system.Thread;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import real_time_event.ticketing_system.entity.Event;
import real_time_event.ticketing_system.service.EventService;
import java.util.HashMap;
import java.util.Map;

public class VendorThread implements Runnable {
    private final Logger logger = LoggerFactory.getLogger(VendorThread.class);
    private final int eventId;
    private final int vendorId;
    private final EventService eventService;
    private final SimpMessagingTemplate messagingTemplate;
    private boolean maxCapacityReached = false;
    private Event event;

    public VendorThread(int eventId, int vendorId, EventService eventService, SimpMessagingTemplate messagingTemplate) {
        this.eventId = eventId;
        this.vendorId = vendorId;
        this.eventService = eventService;
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void run() {
        logger.info("Vendor " + vendorId + " started");
        Map<String, Object> startMessage = new HashMap<>();
        startMessage.put("type", "TRANSACTION");
        startMessage.put("message", "Vendor " + vendorId + " started working");
        messagingTemplate.convertAndSend("/topic/event-updates", startMessage);

        while (!Thread.currentThread().isInterrupted() && !maxCapacityReached) {
            try {
                String result = eventService.addTickets(eventId);
                logger.info("Vendor " + vendorId + " : " + result);

                // Send WebSocket message for each ticket addition
                Map<String, Object> ticketMessage = new HashMap<>();
                ticketMessage.put("type", "TRANSACTION");
                ticketMessage.put("message", "Vendor " + vendorId + ": " + result);
                messagingTemplate.convertAndSend("/topic/event-updates", ticketMessage);
                Event event = eventService.getAvailableTickets(eventId);
                Map<String, Object> message2 = new HashMap<>();
                message2.put("type", "TICKET_UPDATE");
                message2.put("availableTickets", event.getMaxTicketCapacity() - event.getTotalTickets());
                message2.put("totalTransactions", event.getTotalTickets());
                messagingTemplate.convertAndSend("/topic/ticket-updates", message2);

                if (result.contains("Max capacity reached")) {
                    maxCapacityReached = true;
                    break;
                }

                Thread.sleep(event.getTicketReleaseRate());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        // Send stop message
        Map<String, Object> stopMessage = new HashMap<>();
        stopMessage.put("type", "TRANSACTION");
        stopMessage.put("message", "Vendor " + vendorId + " stopped working");
        messagingTemplate.convertAndSend("/topic/event-updates", stopMessage);
    }
}