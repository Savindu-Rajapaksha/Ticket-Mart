package real_time_event.ticketing_system.Thread;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import real_time_event.ticketing_system.entity.Event;
import real_time_event.ticketing_system.service.EventService;
import java.util.HashMap;
import java.util.Map;

public class CustomerThread implements Runnable {
    private final Logger logger = LoggerFactory.getLogger(CustomerThread.class);
    private final int eventId;
    private final int customerId;
    private final EventService eventService;
    private final SimpMessagingTemplate messagingTemplate;
    private boolean noTicketsAvailable = false;
    private Event event;

    public CustomerThread(int eventId, int customerId, EventService eventService, SimpMessagingTemplate messagingTemplate) {
        this.eventId = eventId;
        this.customerId = customerId;
        this.eventService = eventService;
        this.messagingTemplate = messagingTemplate;
    }

    // Get event details at the start of run
    @Override
    public void run() {
        logger.info("Customer " + customerId + " started");
        Map<String, Object> startMessage = new HashMap<>();
        startMessage.put("type", "TRANSACTION");
        startMessage.put("message", "Customer " + customerId + " started purchasing");
        messagingTemplate.convertAndSend("/topic/event-updates", startMessage);

        while (!Thread.currentThread().isInterrupted() && !noTicketsAvailable) {
            try {
                String result = eventService.removeTickets(eventId);
                logger.info("Customer " + customerId + " : " + result);

                // Send WebSocket message for each ticket purchase
                Map<String, Object> purchaseMessage = new HashMap<>();
                purchaseMessage.put("type", "TRANSACTION");
                purchaseMessage.put("message", "Customer " + customerId + ": " + result);
                messagingTemplate.convertAndSend("/topic/event-updates", purchaseMessage);

                if (result.contains("No tickets available")) {
                    noTicketsAvailable = true;
                    break;
                }

                Thread.sleep(event.getCustomerRetrievalRate());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        // Send stop message
        Map<String, Object> stopMessage = new HashMap<>();
        stopMessage.put("type", "TRANSACTION");
        stopMessage.put("message", "Customer " + customerId + " stopped purchasing");
        messagingTemplate.convertAndSend("/topic/event-updates", stopMessage);
    }
}