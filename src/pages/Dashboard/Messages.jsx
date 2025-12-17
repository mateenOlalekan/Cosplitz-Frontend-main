import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  Check, 
  CheckCheck, 
  Send, 
  Phone, 
  Video, 
  Users,
  UserPlus,
  MessageSquare
} from 'lucide-react';

const MessagingDashboard = () => {
  const [activeGroup, setActiveGroup] = useState('Concert Ticket Group');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  // Mock data for groups
  const groups = [
    {
      id: 1,
      name: 'Concert Ticket Group',
      description: 'Request for the client',
      members: 5,
      unread: 2,
      active: true,
      lastMessage: 'Android/Android/Android',
      time: '10:30 AM'
    },
    {
      id: 2,
      name: 'Jumps',
      description: 'Request for the client',
      members: 3,
      unread: 0,
      lastMessage: 'PTSD phone update',
      time: 'Yesterday'
    },
    {
      id: 3,
      name: 'Pizza Party Group',
      description: 'Request for the client',
      members: 8,
      unread: 5,
      lastMessage: 'Order confirmed!',
      time: '11:45 AM'
    },
    {
      id: 4,
      name: 'Smart Tail Group',
      description: 'Request for the client',
      members: 4,
      unread: 0,
      lastMessage: 'Android/Android/Android',
      time: 'Monday'
    },
    {
      id: 5,
      name: 'Bulls Concerted Group',
      description: 'Request for the client',
      members: 6,
      unread: 1,
      lastMessage: 'Meeting at 3 PM',
      time: '9:15 AM'
    },
    {
      id: 6,
      name: 'Bulk Groceries Group',
      description: 'Shared shopping list',
      members: 4,
      unread: 0,
      lastMessage: 'Milk and eggs added',
      time: 'Sunday'
    },
    {
      id: 7,
      name: 'Tony / Joyce',
      description: 'Personal chat',
      members: 2,
      unread: 3,
      lastMessage: 'See you tomorrow!',
      time: 'Just now'
    }
  ];

  // Mock messages for active group
  useEffect(() => {
    const sampleMessages = {
      'Concert Ticket Group': [
        { id: 1, text: 'You joined the splitz', sender: 'system', time: '10:28 AM', read: true },
        { id: 2, text: 'Please choose to be free for background and contact with you about this policy.', sender: 'admin', time: '10:29 AM', read: true },
        { id: 3, text: 'Thanks to join us', sender: 'admin', time: '10:29 AM', read: true },
        { id: 4, text: 'Some more fun I just want to express that information on my favorite drink along others.', sender: 'user', time: '10:30 AM', read: true },
        { id: 5, text: 'Please contact', sender: 'user', time: '10:30 AM', read: true },
        { id: 6, text: 'Apply to join us', sender: 'admin', time: '10:31 AM', read: false },
        { id: 7, text: 'Android/Android/Android', sender: 'user', time: '10:31 AM', read: false }
      ],
      'default': [
        { id: 1, text: 'Chat and get engaged with your splitz.', sender: 'system', time: 'Today', read: true }
      ]
    };
    
    setMessages(sampleMessages[activeGroup] || sampleMessages.default);
  }, [activeGroup]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 font-sans">
      {/* Sidebar - Groups List */}
      <div className="w-full lg:w-1/3 xl:w-1/4 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <p className="text-sm text-gray-500 mt-1">Chat and get engaged with your splitz.</p>
        </div>
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          {groups.map((group) => (
            <div
              key={group.id}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                activeGroup === group.name ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => setActiveGroup(group.name)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{group.name}</h3>
                    <span className="text-xs text-gray-500">{group.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">{group.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 truncate">{group.lastMessage}</p>
                    {group.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {group.unread}
                      </span>
                    )}
                  </div>
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">
                {activeGroup === 'Concert Ticket Group' ? 'Concert Ticket Splitz Group' : activeGroup}
              </h2>
              <div className="flex items-center space-x-2">
                {activeGroup === 'Concert Ticket Group' ? (
                  <>
                    <span className="text-sm text-gray-600">3 members</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">About Help</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-600">
                    {groups.find(g => g.name === activeGroup)?.members || 2} members
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Phone className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500" />
            <Video className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500" />
            <UserPlus className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-500" />
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {activeGroup === 'Concert Ticket Group' && (
            <div className="mb-6">
              <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">Concert Ticket Splitz Group</h3>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Users className="w-4 h-4 mr-1" />
                  <span>3 members</span>
                  <span className="mx-2">•</span>
                  <span className="text-blue-500 font-medium">About Help</span>
                </div>
                
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">You joined the splitz</span>
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium">[Please choose to be free for background and contact with you about this policy.]</span>
                  </p>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Thanks to join us</span>
                  </div>
                  <p>
                    Some more fun I just want to express that information on my favorite drink along others.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition">
                      Please contact
                    </button>
                    <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg text-sm hover:bg-blue-50 transition">
                      Apply to join us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Messages List */}
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : message.sender === 'admin'
                      ? 'bg-purple-100 text-gray-800 rounded-tl-none'
                      : 'bg-gray-100 text-gray-600 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-end mt-1">
                    <span className="text-xs opacity-80">{message.time}</span>
                    {message.sender === 'user' && (
                      <span className="ml-1">
                        {message.read ? (
                          <CheckCheck className="w-3 h-3" />
                        ) : (
                          <Check className="w-3 h-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="max-w-3xl mx-auto flex items-center space-x-3">
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-500"
              />
            </div>
            <button
              onClick={sendMessage}
              className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
          {activeGroup === 'Concert Ticket Group' && (
            <p className="text-center text-xs text-gray-500 mt-2">
              Jumps in PTSD phone
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingDashboard;