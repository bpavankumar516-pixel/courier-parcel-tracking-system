import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Headphones,
  RotateCcw,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  MessageSquare
} from 'lucide-react';
import { useSupport } from '../../context/SupportContext';
import { Link } from 'react-router-dom';

const SupportChatDrawer = () => {
  const {
    isOpen,
    isTyping,
    messages,
    agentConnected,
    closeSupportChat,
    sendMessage,
    selectOption,
    resetChat
  } = useSupport();

  const [inputVal, setInputVal] = useState('');
  const chatBottomRef = useRef(null);

  // Auto scroll to bottom when messages update or typing status changes
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const renderMessageContent = (msg) => {
    return (
      <div className="space-y-2.5">
        <p className="text-xs leading-relaxed whitespace-pre-line font-medium">
          {msg.text}
        </p>

        {/* Embedded Shipment Data Card */}
        {msg.shipmentCard && (
          <div className="mt-2 bg-white rounded-2xl p-3 border border-[#DCE6D2] shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-[#F0F5EC] pb-2">
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#385429]" />
                <span className="font-extrabold text-xs text-[#233D19]">
                  {msg.shipmentCard.trackingNo}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  msg.shipmentCard.status === 'Delivered'
                    ? 'bg-[#E8F5E9] text-[#2E7D32]'
                    : msg.shipmentCard.status === 'In Transit'
                    ? 'bg-[#E3F2FD] text-[#1976D2]'
                    : 'bg-[#FFF3E0] text-[#E65100]'
                }`}
              >
                {msg.shipmentCard.status}
              </span>
            </div>

            <div className="text-[11px] text-[#4F6C3A] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#6B8556]">Receiver:</span>
                <span className="font-bold text-[#233D19]">{msg.shipmentCard.receiver || msg.shipmentCard.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B8556]">Current Location:</span>
                <span className="font-semibold text-[#233D19] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#587640]" />
                  {msg.shipmentCard.currentLocation || msg.shipmentCard.deliveryAddress}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B8556]">Estimated Delivery:</span>
                <span className="font-semibold text-[#233D19] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#587640]" />
                  {msg.shipmentCard.estimatedDelivery || msg.shipmentCard.eta || 'Sep 03, 2026'}
                </span>
              </div>
            </div>

            <Link
              to={`/tracking?trackingNo=${msg.shipmentCard.trackingNo}`}
              onClick={closeSupportChat}
              className="mt-1 w-full bg-[#F0F6E8] hover:bg-[#E2EDD6] text-[#233D19] text-[11px] font-bold py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition border border-[#DCE6D2]"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Open Parcel Tracking</span>
            </Link>
          </div>
        )}

        {/* Dynamic Quick Action Chips */}
        {msg.options && msg.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {msg.options.map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => selectOption(opt)}
                className="bg-white hover:bg-[#EAF3D8] text-[#233D19] border border-[#DCE6D2] text-[11px] font-semibold py-1 px-2.5 rounded-full shadow-2xs transition-all cursor-pointer flex items-center gap-1 hover:scale-102"
              >
                <span>{opt}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-['Inter']">
      {/* Dim Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeSupportChat}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#DCE6D2] flex flex-col justify-between animate-in slide-in-from-right duration-250">
          
          {/* Header */}
          <div className="bg-[#233D19] text-white p-4 px-5 flex items-center justify-between border-b border-[#385429]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-[#385429] flex items-center justify-center text-white border border-[#587640] shadow-sm">
                  {agentConnected ? (
                    <Headphones className="w-5 h-5 text-[#A3E635]" />
                  ) : (
                    <Bot className="w-5 h-5 text-[#A3E635]" />
                  )}
                </div>
                {/* Active Green Dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#233D19] rounded-full animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-sm text-white leading-tight">
                    {agentConnected ? 'Sarah (Live Support Agent)' : 'Deliverly AI Assistant'}
                  </h3>
                  <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                </div>
                <p className="text-[10px] text-[#A3C986] font-medium">
                  {agentConnected ? 'Live Support • Active Now' : 'Powered by Deliverly AI • 24/7 Logistics Bot'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                title="Reset Chat"
                className="p-1.5 text-[#A3C986] hover:text-white hover:bg-[#385429] rounded-xl transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={closeSupportChat}
                title="Close Chat"
                className="p-1.5 text-[#A3C986] hover:text-white hover:bg-[#385429] rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Message History Area */}
          <div className="flex-1 p-4 px-5 overflow-y-auto space-y-4 bg-[#F9FCF7]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isSystem = msg.sender === 'system';
              const isAgent = msg.sender === 'agent';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-2">
                    <span className="bg-[#EBF3DF] border border-[#D0E2B8] text-[#233D19] text-[10px] font-bold px-3 py-1 rounded-full shadow-2xs">
                      {msg.text}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  {/* Sender Avatar */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-[#233D19] text-white'
                        : isAgent
                        ? 'bg-[#2E7D32] text-white'
                        : 'bg-[#587640] text-white'
                    }`}
                  >
                    {isUser ? (
                      <User className="w-4 h-4" />
                    ) : isAgent ? (
                      <Headphones className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Container */}
                  <div className={`max-w-[82%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3 rounded-2xl shadow-2xs ${
                        isUser
                          ? 'bg-[#233D19] text-white rounded-tr-none'
                          : isAgent
                          ? 'bg-white text-[#233D19] border border-[#2E7D32]/30 rounded-tl-none'
                          : 'bg-white text-[#233D19] border border-[#DCE6D2] rounded-tl-none'
                      }`}
                    >
                      {renderMessageContent(msg)}
                    </div>
                    <span
                      className={`text-[9px] font-medium text-[#7A9369] block px-1 ${
                        isUser ? 'text-right' : 'text-left'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#587640] text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-[#DCE6D2] px-4 py-2.5 rounded-2xl rounded-tl-none shadow-2xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#587640] rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-[#587640] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-[#587640] rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-[#587640] font-semibold ml-1">
                    {agentConnected ? 'Sarah is typing...' : 'Deliverly AI is typing...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Input Actions Footer */}
          <div className="p-3 px-4 bg-white border-t border-[#DCE6D2] space-y-2">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  agentConnected
                    ? 'Type message to Sarah...'
                    : 'Ask Deliverly bot or type tracking no...'
                }
                className="flex-1 bg-[#F4F7EF] border border-[#DCE6D2] rounded-2xl px-3.5 py-2.5 text-xs text-[#233D19] placeholder-[#7F996B] focus:outline-none focus:ring-2 focus:ring-[#587640]/30 transition"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="w-9 h-9 rounded-2xl bg-[#233D19] hover:bg-[#385429] disabled:opacity-40 text-white flex items-center justify-center shadow-2xs transition cursor-pointer flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-[#7A9369] px-1">
              <span>Instant AI Logistics Support</span>
              <button
                type="button"
                onClick={() => selectOption('🧑‍💼 Talk to a Live Agent')}
                className="hover:underline text-[#233D19] font-bold flex items-center gap-1 cursor-pointer"
              >
                <Headphones className="w-3 h-3 text-[#587640]" />
                <span>Need Human Help?</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SupportChatDrawer;
