// src/services/WebSocketService.js
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map();
        this.isConnected = false;
        this.reconnectTimeout = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.debug = true; // Enable debug logging
    }

    connect(onMessageReceived) {
        const socket = new SockJS('http://localhost:8084/ws');
        this.stompClient = Stomp.over(socket);
        
        this.stompClient.connect({}, () => {
            console.log('WebSocket Connected');
            this.connected = true;

            // Subscribe to all relevant topics
            this.subscribe('/topic/event-updates', onMessageReceived);
            this.subscribe('/topic/thread-updates', onMessageReceived);
            this.subscribe('/topic/ticket-updates', onMessageReceived);
            this.subscribe('/topic/status-updates', onMessageReceived);
        }, error => {
            console.error('WebSocket Connection Error:', error);
            this.connected = false;
            setTimeout(() => this.connect(onMessageReceived), 5000); // Retry connection
        });
    }

    subscribe(destination, callback) {
        if (this.stompClient && this.connected) {
            console.log(`Subscribing to ${destination}`);
            const subscription = this.stompClient.subscribe(destination, message => {
                try {
                    const data = JSON.parse(message.body);
                    console.log(`Received message from ${destination}:`, data);
                    callback(data);
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            });
            this.subscriptions.set(destination, subscription);
        }
    }

    handleConnectionError(onConnected, onError) {
        if (onError) {
            onError();
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            
            console.log(`Attempting to reconnect in ${delay/1000} seconds... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            this.reconnectTimeout = setTimeout(() => {
                this.connect(onConnected, onError);
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        this.subscriptions.forEach((subscription, destination) => {
            console.log(`Unsubscribing from ${destination}`);
            subscription.unsubscribe();
        });
        this.subscriptions.clear();

        if (this.stompClient) {
            if (this.stompClient.connected) {
                console.log('Disconnecting WebSocket...');
                this.stompClient.disconnect();
            }
            this.stompClient = null;
        }

        this.isConnected = false;
        this.reconnectAttempts = 0;
        console.log('WebSocket disconnected');
    }

    isConnectedToServer() {
        return this.isConnected && this.stompClient?.connected;
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;