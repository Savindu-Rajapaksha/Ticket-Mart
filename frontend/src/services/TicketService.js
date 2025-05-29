// src/services/TicketService.js
import axios from 'axios';

class TicketService {
    constructor() {
        this.API_URL = 'http://localhost:8084/api/v1/event';
        this.axiosInstance = axios.create({
            baseURL: this.API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async addEvent(eventData) {
        try {
            const response = await fetch(`${this.API_URL}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(eventData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error('Error adding event:', error);
            throw error;
        }
    }

    async startEvent(eventId = 1) {
        try {
            console.log('Starting event:', eventId);
            const response = await fetch(`${this.API_URL}/start/`+eventId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Start event response status:', response.status);
            const responseText = await response.text();
            console.log('Start event response:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} message: ${responseText}`);
            }

            return responseText;
        } catch (error) {
            console.error('Error in startEvent:', error);
            throw new Error(error.message || 'Failed to start event');
        }
    }

    async stopEvent(eventId = 1) {
        try {
            console.log('Stopping event:', eventId);
            console.log(`${this.API_URL}/stop/`+eventId);
            const response = await fetch(`${this.API_URL}/stop/`+eventId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Stop event response status:', response.status);
            const responseText = await response.text();
            console.log('Stop event response:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} message: ${responseText}`);
            }

            return responseText;
        } catch (error) {
            console.error('Error in stopEvent:', error);
            throw new Error(error.message || 'Failed to stop event');
        }
    }

    async addTickets(eventId = 1) {
        try {
            console.log('Adding tickets for event:', eventId);
            const response = await fetch(`${this.API_URL}/ticket_add`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Add tickets response status:', response.status);
            const responseText = await response.text();
            console.log('Add tickets response:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} message: ${responseText}`);
            }

            return responseText;
        } catch (error) {
            console.error('Error in addTickets:', error);
            throw new Error(error.message || 'Failed to add tickets');
        }
    }

    async removeTickets(eventId = 1) {
        try {
            console.log('Removing tickets for event:', eventId);
            const response = await fetch(`${this.API_URL}/ticket_remove`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('Remove tickets response status:', response.status);
            const responseText = await response.text();
            console.log('Remove tickets response:', responseText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} message: ${responseText}`);
            }

            return responseText;
        } catch (error) {
            console.error('Error in removeTickets:', error);
            throw new Error(error.message || 'Failed to remove tickets');
        }
    }
}

const ticketService = new TicketService();
export default ticketService;