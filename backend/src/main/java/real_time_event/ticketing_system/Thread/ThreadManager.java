package real_time_event.ticketing_system.Thread;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import real_time_event.ticketing_system.entity.Event;
import real_time_event.ticketing_system.service.EventService;

import java.util.concurrent.ConcurrentHashMap;
import java.util.HashMap;
import java.util.Map;

@Component
public class ThreadManager {
    private final ConcurrentHashMap<String, Thread> runningThreads = new ConcurrentHashMap<>();

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private void sendMessage(String message) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "TRANSACTION");
        payload.put("message", message);
        System.out.println("Sending message from ThreadManager: " + message);  // Debug log
        messagingTemplate.convertAndSend("/topic/event-updates", payload);
    }

    public void startEventThreads(int eventId, EventService eventService, Event event) {
        Map<String, Object> message1 = new HashMap<>();
        message1.put("type", "THREAD_UPDATE");
        message1.put("vendorThreads", 2);
        message1.put("customerThreads", 3);
        messagingTemplate.convertAndSend("/topic/thread-updates", message1);


        // Start vendor threads
        for (int i = 1; i <= 2; i++) {
            VendorThread vendorThread = new VendorThread(eventId, i, eventService, messagingTemplate);
            Thread thread = new Thread(vendorThread, "Vendor-" + i);
            runningThreads.put(thread.getName(), thread);
            thread.start();
        }

        // Start customer threads
        for (int i = 1; i <= 3; i++) {
            CustomerThread customerThread = new CustomerThread(eventId, i, eventService, messagingTemplate);
            Thread thread = new Thread(customerThread, "Customer-" + i);
            runningThreads.put(thread.getName(), thread);
            thread.start();
        }

        // Send message that threads started
        Map<String, Object> message = new HashMap<>();
        message.put("type", "TRANSACTION");
        message.put("message", "Started 2 vendor threads and 3 customer threads");
        messagingTemplate.convertAndSend("/topic/event-updates", message);
    }

    public void stopAllThreads() {
        sendMessage("Stopping all threads...");
        for (Thread thread : runningThreads.values()) {
            thread.interrupt();
        }
        runningThreads.clear();
        sendMessage("All threads stopped");
    }
}