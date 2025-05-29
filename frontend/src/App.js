// src/App.js
import React, { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import SystemConfig from "./components/SystemConfig";
import ControlPanel from "./components/ControlPanel";
import ActiveThreads from "./components/ActiveThreads";
import TicketPool from "./components/TicketPool";
import TransactionLog from "./components/TransactionLog";
import webSocketService from "./services/WebSocketService";
import ticketService from "./services/TicketService";
import "./App.css";

const App = () => {
  // System Configuration State
  const [config, setConfig] = useState({
    id: 0
  ,
    name: "Ticket Event",
    totalTickets: 100,
    ticketReleaseRate: 1000,
    customerRetrievalRate: 1000,
    maxTicketCapacity: 500,
  });

  // System Status State
  const [status, setStatus] = useState("idle"); // idle, running, stopped
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  // Application State
  const [poolStatus, setPoolStatus] = useState({
    availableTickets: 0,
    totalTransactions: 0,
    capacityUsage: 0,
  });

  const [threads, setThreads] = useState({
    vendorThreads: 0,
    customerThreads: 0,
  });

  const [transactions, setTransactions] = useState([]);

  // Transaction Logging
  const addTransaction = useCallback((message) => {
    setTransactions((prev) => [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        message,
      },
      ...prev.slice(0, 99),
    ]); // Keep last 100 transactions
  }, []);

  // WebSocket Message Handler
  const handleWebSocketMessage = useCallback(
    (data) => {
      console.log("Received WebSocket message:", JSON.stringify(data)); // Detailed logging
      console.log("Type:", data.type);
      switch (data.type) {
        case "TRANSACTION":
          console.log("Processing transaction:", data.message);
          addTransaction(data.message);
          break;

        case "TICKET_UPDATE":
          console.log("Processing ticket update");
          setPoolStatus((prev) => ({
            availableTickets: data.availableTickets,
            totalTransactions: data.totalTransactions,
            capacityUsage:
              (100 / config.maxTicketCapacity) * data.availableTickets,
          }));
          //addTransaction(`Ticket update: ${data.message}`);
          break;

        case "THREAD_UPDATE":
          console.log("Processing thread update");
          console.log(data.vendorThreads);
          console.log(data.customerThreads);
          setThreads({
            vendorThreads: data.vendorThreads || 0,
            customerThreads: data.customerThreads || 0,
          });
          if (data.message) {
            addTransaction(`Thread update: ${data.message}`);
          }
          break;

        default:
          console.log("Unknown message type:", data.type);
      }
    },
    [config.maxTicketCapacity, addTransaction]
  );

  // WebSocket Connection Setup
  useEffect(() => {
    const setupWebSocket = () => {
      webSocketService.connect(
        // onConnected callback
        () => {
          setConnected(true);
          setError(null);
          console.log("WebSocket Connected, subscribing to topics...");

          // Subscribe to topics
          webSocketService.subscribe(
            "/topic/event-updates",
            handleWebSocketMessage
          );
          webSocketService.subscribe(
            "/topic/status-updates",
            handleWebSocketMessage
          );
          webSocketService.subscribe(
            "/topic/ticket-updates",
            handleWebSocketMessage
          );
          webSocketService.subscribe(
            "/topic/thread-updates",
            handleWebSocketMessage
          );
        },
        // onError callback
        () => {
          setConnected(false);
          setError("WebSocket connection lost. Attempting to reconnect...");
        }
      );
    };

    setupWebSocket();
    console.log("WebSocket setup initiated");

    // Cleanup on component unmount
    return () => {
      console.log("Cleaning up WebSocket connection");
      webSocketService.disconnect();
    };
  }, [handleWebSocketMessage]);

  // Configuration Handler
  const handleConfigChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };

  // Event Control Handlers
  const handleStart = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting event with config:", config);

      // First add the event
      const addResponse = await ticketService.addEvent(config);
      addTransaction(`Event configuration: ${addResponse}`);
      console.log("Event added:", addResponse);
      setConfig((prevConfig) => ({
        ...prevConfig,
        id: addResponse, // Assuming `data.id` is the field from the API response
      }));
      // Then start the event
      const startResponse = await ticketService.startEvent(addResponse);
      
      addTransaction(startResponse);
      setStatus("running");
      console.log("Event started:", startResponse);
    } catch (error) {
      console.error("Start event error:", error);
      setError(error.message);
      addTransaction(`Failed to start event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Stopping event...");
      console.log(config.id);

      const response = await ticketService.stopEvent(config.id);
      addTransaction(response);
      setStatus("stopped");
      console.log("Event stopped:", response);
    } catch (error) {
      console.error("Stop event error:", error);
      setError(error.message);
      addTransaction(`Failed to stop event: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Restarting system...");

      // Reset all states
      setStatus("idle");
      setPoolStatus({
        availableTickets: 0,
        totalTransactions: 0,
        capacityUsage: 0,
      });
      setThreads({
        vendorThreads: 0,
        customerThreads: 0,
      });
      setTransactions([]);

      addTransaction("System restarted");
      console.log("System restart completed");
    } catch (error) {
      console.error("Restart error:", error);
      setError(error.message);
      addTransaction(`Failed to restart system: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        <Header />
        {!connected && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md mb-4">
            Connecting to server...
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md mb-4">
            Error: {error}
          </div>
        )}
      </div>

      <div className="px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SystemConfig
              config={config}
              onConfigChange={handleConfigChange}
              disabled={status === "running" || loading}
            />

            <ControlPanel
              status={status}
              onStart={handleStart}
              onStop={handleStop}
              onRestart={handleRestart}
              loading={loading}
            />

            <ActiveThreads
              vendorThreads={threads.vendorThreads}
              customerThreads={threads.customerThreads}
            />
          </div>

          <div className="space-y-6">
            <TicketPool
              availableTickets={poolStatus.availableTickets}
              totalTransactions={poolStatus.totalTransactions}
              capacityUsage={poolStatus.capacityUsage}
              maxCapacity={config.maxTicketCapacity}
            />

            <TransactionLog transactions={transactions} />
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="container mx-auto flex justify-between text-sm">
          <div className="flex items-center">
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                connected ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span>{connected ? "Connected" : "Disconnected"}</span>
          </div>
          <div>
            Status: <span className="font-medium capitalize">{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
