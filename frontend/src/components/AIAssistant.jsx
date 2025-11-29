import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  SparklesIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  BookOpenIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { Button, Avatar, Loader, useToast } from './ui';
import api from '../services/api';

const AIAssistant = () => {
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();
  const addToast = toast.addToast ? toast.addToast : null;
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch enrolled courses directly on mount (if student)
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (user && user.role === 'student') {
        try {
          const res = await api.get('/courses?enrolled=true');
          setEnrolledCourses(res.data.data || []);
        } catch (err) {
          setEnrolledCourses([]);
        }
      }
    };
    fetchEnrolledCourses();
  }, [user]);

  // --- AI Assistant Chat History Integration ---
  // Load chat history on login/page reload
  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        try {
          const res = await api.get('/chat/ai');
          setChatList(res.data.data || []);
          // Auto-load most recent chat
          if (res.data.data && res.data.data.length > 0) {
            setActiveChatId(res.data.data[0]._id);
            setMessages(res.data.data[0].messages.map((m, i) => ({
              id: i,
              type: m.sender === 'user' ? 'user' : 'ai',
              content: m.content,
              timestamp: m.timestamp
            })));
          }
        } catch (err) {
          setChatList([]);
        }
      }
    };
    fetchChats();
  }, [user]);

  // Start a new chat
  const handleNewChat = async () => {
    try {
      const res = await api.post('/chat/ai', { conversationName: 'New Chat' });
      setChatList((prev) => [res.data.data, ...prev]);
      setActiveChatId(res.data.data._id);
      setMessages([]);
    } catch (err) {
      addToast && addToast('Failed to start new chat', 'error');
    }
  };

  // Switch chat
  const handleSelectChat = async (chatId) => {
    setActiveChatId(chatId);
    const chat = chatList.find((c) => c._id === chatId);
    if (chat) {
      setMessages(chat.messages.map((m, i) => ({
        id: i,
        type: m.sender === 'user' ? 'user' : 'ai',
        content: m.content,
        timestamp: m.timestamp
      })));
    } else {
      // fallback: fetch from API
      try {
        const res = await api.get(`/chat/ai/${chatId}`);
        setMessages(res.data.data.messages.map((m, i) => ({
          id: i,
          type: m.sender === 'user' ? 'user' : 'ai',
          content: m.content,
          timestamp: m.timestamp
        })));
      } catch (err) {
        setMessages([]);
      }
    }
  };

  // Save message to chat history
  const saveMessageToHistory = async (sender, content) => {
    if (!activeChatId) return;
    try {
      await api.post(`/chat/ai/${activeChatId}/message`, { sender, content });
      // Optionally update chatList state for last message preview
    } catch (err) {
      // Ignore for now
    }
  };
  // --- End AI Assistant Chat History Integration ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- Save chat messages to backend on send ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    await saveMessageToHistory('user', inputMessage);

    try {
      const response = await api.post('/ai/ask', {
        question: inputMessage,
        context: `Student: ${user?.name}, Current courses: learning platform`
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.data.answer,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, aiMessage]);
      await saveMessageToHistory('ai', response.data.data.answer);
    } catch (error) {
      console.error('Error getting AI response:', error);
      addToast('Failed to get AI response', 'error');
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I couldn't process your question at the moment. Please try again later.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
      await saveMessageToHistory('ai', errorMessage.content);
    } finally {
      setLoading(false);
    }
  };
  // --- End Save chat messages to backend ---

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      if (!enrolledCourses || enrolledCourses.length === 0) {
        if (addToast) {
          addToast('No enrolled courses found. Please enroll in a course to get recommendations.', 'error');
        } else if (toast && toast.error) {
          toast.error('No enrolled courses found. Please enroll in a course to get recommendations.');
        }
        setLoading(false);
        return;
      }
      const selectedCourseId = enrolledCourses[0]._id;
      const response = await api.post('/ai/recommend', {
        courseId: selectedCourseId,
        userId: user?._id
      });
      setRecommendations(response.data.data);
      setShowRecommendations(true);
      const recommendMessage = {
        id: Date.now(),
        type: 'ai',
        content: "I've generated personalized recommendations for you! Check out the recommendations tab.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, recommendMessage]);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      if (addToast) {
        addToast('Failed to get recommendations', 'error');
      } else if (toast && toast.error) {
        toast.error('Failed to get recommendations');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'How do I prepare for my next assignment?',
    'Can you recommend study resources?',
    'What should I focus on this week?',
    'Help me create a study plan'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Open AI Assistant"
        >
          <SparklesIcon className="h-6 w-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
          </span>
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-xs rounded py-1 px-3 whitespace-nowrap">
              Ask AI Assistant
              <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-end sm:items-end md:items-center justify-center z-50"
        >
          {/* Overlay for mobile/modal */}
            <div
              className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-md backdrop-saturate-150 sm:hidden"
              style={{ WebkitBackdropFilter: 'blur(16px) saturate(150%)' }}
              onClick={() => setIsOpen(false)}
            />
          <div
            className="relative w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-2xl h-[90vh] max-h-[700px] sm:h-[600px] sm:bottom-6 sm:right-6 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in mx-0 sm:mx-0"
            style={{
              boxShadow: '0 10px 32px 0 rgba(80, 63, 205, 0.15)',
              minWidth: '320px',
              width: '100vw',
              maxWidth: '100vw',
              minHeight: '400px',
            }}
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></span>
              </div>
              <div>
                <h3 className="font-semibold">AI Study Assistant</h3>
                <p className="text-xs text-purple-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition sm:block block"
              aria-label="Close AI Assistant"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setShowRecommendations(false)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                !showRecommendations
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setShowRecommendations(true)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                showRecommendations
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Recommendations
            </button>
          </div>

          {/* Responsive Chat List Sidebar (Desktop Only) */}
          <div className="absolute left-0 top-0 h-full w-48 bg-gray-100 border-r border-gray-200 z-10 flex flex-col hidden lg:flex">
            <div className="flex items-center justify-between p-2 border-b border-gray-200">
              <span className="font-semibold text-xs text-gray-700">Conversations</span>
              <button
                onClick={handleNewChat}
                className="p-1 rounded hover:bg-indigo-100"
                title="New Chat"
                aria-label="New Chat"
              >
                <span className="text-indigo-600 text-lg font-bold">+</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chatList.length === 0 && (
                <div className="text-xs text-gray-400 p-4">No chats yet</div>
              )}
              {chatList.map((chat) => (
                <button
                  key={chat._id}
                  onClick={() => handleSelectChat(chat._id)}
                  className={`w-full text-left px-3 py-2 border-b border-gray-100 text-xs hover:bg-indigo-50 ${activeChatId === chat._id ? 'bg-indigo-100 font-semibold' : ''}`}
                >
                  {chat.conversationName || 'Untitled Chat'}
                  <div className="text-gray-400 text-[10px] truncate">
                    {chat.messages.length > 0 ? chat.messages[chat.messages.length-1].content.slice(0, 30) : 'No messages'}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Mobile Menu Icon & Drawer */}
          {isOpen && (
            <>
              <button
                className="absolute left-2 top-2 lg:hidden bg-white border border-gray-200 rounded-full p-2 shadow z-20"
                onClick={() => setShowSidebar(true)}
                aria-label="Show conversations"
              >
                <ChevronDownIcon className="h-5 w-5 text-indigo-600" />
              </button>
              <div className={`fixed inset-0 z-50 bg-black/30 lg:hidden ${showSidebar ? '' : 'hidden'}`}
                   onClick={() => setShowSidebar(false)}>
                <div className="absolute left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col shadow-xl"
                     onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between p-2 border-b border-gray-200">
                    <span className="font-semibold text-xs text-gray-700">Conversations</span>
                    <button
                      onClick={handleNewChat}
                      className="p-1 rounded hover:bg-indigo-100"
                      title="New Chat"
                      aria-label="New Chat"
                    >
                      <span className="text-indigo-600 text-lg font-bold">+</span>
                    </button>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="ml-2 text-gray-400 hover:text-gray-700"
                      aria-label="Close"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {chatList.length === 0 && (
                      <div className="text-xs text-gray-400 p-4">No chats yet</div>
                    )}
                    {chatList.map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => { handleSelectChat(chat._id); setShowSidebar(false); }}
                        className={`w-full text-left px-3 py-2 border-b border-gray-100 text-xs hover:bg-indigo-50 ${activeChatId === chat._id ? 'bg-indigo-100 font-semibold' : ''}`}
                      >
                        {chat.conversationName || 'Untitled Chat'}
                        <div className="text-gray-400 text-[10px] truncate">
                          {chat.messages.length > 0 ? chat.messages[chat.messages.length-1].content.slice(0, 30) : 'No messages'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          {/* End Responsive Sidebar/Drawer */}

          {/* Main Chat Area (responsive margin) */}
          <div className="lg:ml-48 h-full flex-1 flex flex-col">
            {/* Chat View */}
            {!showRecommendations && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SparklesIcon className="h-8 w-8 text-indigo-600" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Hello, {user?.name?.split(' ')[0]}! 👋
                      </h4>
                      <p className="text-xs text-gray-600 mb-4">
                        I'm your AI study assistant. Ask me anything about your courses!
                      </p>
                      
                      {/* Quick Questions */}
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                        {quickQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickQuestion(question)}
                            className="block w-full text-left px-3 py-2 bg-white hover:bg-indigo-50 border border-gray-200 rounded-lg text-xs text-gray-700 transition"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'ai' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                            <SparklesIcon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-indigo-100' : 'text-gray-400'
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <Avatar src={user?.profilePicture} name={user?.name} size="sm" />
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                        <SparklesIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask me anything..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !inputMessage.trim()}
                      className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      aria-label="Send message"
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Recommendations View */}
            {showRecommendations && (
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {!recommendations ? (
                  <div className="text-center py-12">
                    <LightBulbIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Get Personalized Recommendations
                    </h4>
                    <p className="text-xs text-gray-600 mb-4">
                      I'll analyze your progress and suggest courses, books, and resources
                    </p>
                    <Button
                      onClick={handleGetRecommendations}
                      loading={loading}
                      size="sm"
                      leftIcon={<SparklesIcon className="h-4 w-4" />}
                    >
                      Generate Recommendations
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Course Recommendations */}
                    {recommendations.courses && recommendations.courses.length > 0 && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <BookOpenIcon className="h-4 w-4 text-indigo-600" />
                          Recommended Courses
                        </h4>
                        <div className="space-y-2">
                          {recommendations.courses.map((course, index) => (
                            <div key={index} className="text-xs">
                              <p className="font-medium text-gray-900">{course.title}</p>
                              <p className="text-gray-600">{course.reason}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Study Plan */}
                    {recommendations.studyPlan && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Your Study Plan
                        </h4>
                        <p className="text-xs text-gray-700 whitespace-pre-wrap">
                          {recommendations.studyPlan}
                        </p>
                      </div>
                    )}

                    {/* Book Recommendations */}
                    {recommendations.books && recommendations.books.length > 0 && (
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Recommended Books
                        </h4>
                        <div className="space-y-2">
                          {recommendations.books.map((book, index) => (
                            <div key={index} className="text-xs">
                              <p className="font-medium text-gray-900">{book}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGetRecommendations}
                      loading={loading}
                      className="w-full"
                    >
                      Refresh Recommendations
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
