package real_time_event.ticketing_system.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * WebSocket configuration for real-time communication
 */

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        System.out.println("Configuring message broker");
        config.enableSimpleBroker("/topic"); // Enable message broker for topics
        config.setApplicationDestinationPrefixes("/app");    // Set prefix for application endpoints
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("Registering STOMP endpoints"); // WebSocket endpoint path
        registry.addEndpoint("/ws")                 // Allow connections from any origin
                .setAllowedOriginPatterns("*")             // Enable SockJS fallback
                .withSockJS();
    }
}