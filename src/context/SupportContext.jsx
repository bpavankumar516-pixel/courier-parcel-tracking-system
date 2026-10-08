import React, { createContext, useContext, useState } from 'react';
import { useShipments } from './ShipmentContext';

const SupportContext = createContext();

export const SupportProvider = ({ children }) => {
  const { shipments } = useShipments();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [agentConnected, setAgentConnected] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "👋 Hi there! Welcome to Deliverly Live Support. I'm your AI logistics assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      options: [
        '📦 Track my shipment',
        '⏰ Check estimated delivery',
        '📍 Change delivery address',
        '🧑‍💼 Talk to a Live Agent'
      ]
    }
  ]);

  // Open support drawer with optional tracking number pre-loaded
  const openSupportChat = (trackingNo = null) => {
    setIsOpen(true);
    if (trackingNo) {
      handleInitialTrackingQuery(trackingNo);
    }
  };

  const closeSupportChat = () => {
    setIsOpen(false);
  };

  const resetChat = () => {
    setAgentConnected(false);
    setIsTyping(false);
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: "👋 Chat reset. How else can I assist you with your Deliverly shipments today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: [
          '📦 Track my shipment',
          '⏰ Check estimated delivery',
          '📍 Change delivery address',
          '🧑‍💼 Talk to a Live Agent'
        ]
      }
    ]);
  };

  const handleInitialTrackingQuery = (trackingNo) => {
    // Check if message for this tracking number already exists recently
    const hasAlreadyAsked = messages.some(m => m.trackingNo === trackingNo);
    if (hasAlreadyAsked) return;

    const matched = shipments.find(
      (s) => s.trackingNo?.toLowerCase() === trackingNo?.toLowerCase()
    );

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user inquiry note
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: `Inquiry regarding Tracking No: ${trackingNo}`,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (matched) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            trackingNo,
            text: `I retrieved live information for parcel **${matched.trackingNo}**:`,
            shipmentCard: matched,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            options: [
              `📍 Current location of ${matched.trackingNo}`,
              `🧑‍💼 Speak to agent for ${matched.trackingNo}`,
              `📦 Track another shipment`
            ]
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: `I couldn't find a record for tracking number **${trackingNo}**. Please double-check the tracking ID or select one from active shipments:`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            options: shipments.slice(0, 3).map((s) => `📦 ${s.trackingNo} (${s.status})`)
          }
        ]);
      }
    }, 700);
  };

  const sendMessage = (userInputText) => {
    if (!userInputText || !userInputText.trim()) return;

    const query = userInputText.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      processBotReply(query);
    }, 850);
  };

  const selectOption = (optionText) => {
    sendMessage(optionText);
  };

  const connectHumanAgent = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setAgentConnected(true);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: 'system',
          text: '🟢 Live Agent Sarah from Deliverly Support has joined the chat.',
          timestamp: timeStr
        },
        {
          id: Date.now() + 1,
          sender: 'agent',
          text: "Hi! I'm Sarah from Deliverly Customer Care. I have your account details loaded. How can I assist you with your parcel today?",
          timestamp: timeStr
        }
      ]);
    }, 1200);
  };

  const processBotReply = (query) => {
    setIsTyping(false);
    const lower = query.toLowerCase();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Look for matching tracking number inside user query
    const trackingMatch = shipments.find(s => lower.includes(s.trackingNo.toLowerCase()));

    if (trackingMatch) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: agentConnected ? 'agent' : 'bot',
          text: `Here are the latest live details for **${trackingMatch.trackingNo}**:`,
          shipmentCard: trackingMatch,
          timestamp: timeStr,
          options: [
            `⏰ Delivery ETA for ${trackingMatch.trackingNo}`,
            `🧑‍💼 Talk to Live Agent`
          ]
        }
      ]);
      return;
    }

    if (lower.includes('agent') || lower.includes('talk') || lower.includes('human') || lower.includes('person') || lower.includes('help')) {
      if (!agentConnected) {
        connectHumanAgent();
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'agent',
            text: "I'm right here with you! Please let me know what specific issue or address update you need help with.",
            timestamp: timeStr
          }
        ]);
      }
      return;
    }

    if (lower.includes('track') || lower.includes('status') || lower.includes('where')) {
      const activeList = shipments.slice(0, 4);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: agentConnected ? 'agent' : 'bot',
          text: "Here are your recent active shipments in the system. Click any tracking code below to inspect its status:",
          timestamp: timeStr,
          options: activeList.map((s) => `📦 ${s.trackingNo} (${s.status})`)
        }
      ]);
      return;
    }

    if (lower.includes('eta') || lower.includes('time') || lower.includes('estimate') || lower.includes('when')) {
      const sample = shipments[0];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: agentConnected ? 'agent' : 'bot',
          text: sample 
            ? `Standard Deliverly Express shipments take 1-3 business days. Parcel **${sample.trackingNo}** is currently estimated for **${sample.estimatedDelivery || sample.eta}**.`
            : "Deliverly Express parcels deliver within 1-3 business days. Enter a tracking code for exact timing!",
          timestamp: timeStr,
          options: ['📦 Track my shipment', '🧑‍💼 Speak to agent']
        }
      ]);
      return;
    }

    if (lower.includes('address') || lower.includes('change') || lower.includes('location')) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: agentConnected ? 'agent' : 'bot',
          text: "Delivery address updates can be made while parcels are in **Pending** or **Picked Up** status. Select your shipment below or request an agent override:",
          timestamp: timeStr,
          options: ['🧑‍💼 Connect to Agent for Address Update', '📦 View Active Shipments']
        }
      ]);
      return;
    }

    // Default Bot Fallback Response
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: agentConnected ? 'agent' : 'bot',
        text: `Thank you for your message! I can help you check live shipment statuses, estimated delivery dates, or connect you with a live agent. What would you like to do?`,
        timestamp: timeStr,
        options: [
          '📦 Track a shipment',
          '⏰ Check estimated delivery',
          '🧑‍💼 Talk to a Live Agent'
        ]
      }
    ]);
  };

  return (
    <SupportContext.Provider
      value={{
        isOpen,
        isTyping,
        messages,
        agentConnected,
        openSupportChat,
        closeSupportChat,
        sendMessage,
        selectOption,
        connectHumanAgent,
        resetChat
      }}
    >
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => useContext(SupportContext);
