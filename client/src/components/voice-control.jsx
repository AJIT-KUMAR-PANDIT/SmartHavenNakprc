import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Activity } from 'lucide-react';
import { useLocation } from 'wouter';
import { useDevices } from '@/hooks/use-devices';

// Voice commands that the system will recognize
const VOICE_COMMANDS = {
  NAVIGATE: {
    regex: /(?:go to|open|navigate to|show) (dashboard|devices|rooms|scenes|routes|electricity|analytics|logs|settings)/i,
    action: (matches, navigate) => {
      const page = matches[1].toLowerCase();
      const pathMap = {
        'dashboard': '/dashboard',
        'devices': '/devices',
        'rooms': '/rooms',
        'scenes': '/scenes',
        'routes': '/routes',
        'electricity': '/electricity',
        'analytics': '/analytics',
        'logs': '/logs',
        'settings': '/settings'
      };

      if (pathMap[page]) {
        navigate(pathMap[page]);
        return `Navigating to ${page}`;
      }
      return `Could not find page ${page}`;
    }
  },
  TOGGLE_DEVICE: {
    regex: /(?:turn|switch) (on|off) (?:the )?(.*?)(?:light|device|fan|heater|tv)?$/i,
    action: (matches, navigate, { devices, controlDevice }) => {
      const action = matches[1].toLowerCase();
      const deviceName = matches[2].trim().toLowerCase();

      const device = devices.find(d => 
        d.name.toLowerCase().includes(deviceName) || 
        d.type.toLowerCase().includes(deviceName)
      );

      if (device) {
        controlDevice(device.id, action === 'on' ? 'turnOn' : 'turnOff');
        return `Turning ${action} ${device.name}`;
      }
      return `Could not find device "${deviceName}"`;
    }
  },
  SHOW_CONSUMPTION: {
    regex: /(?:show|display|what is) (?:the )?(electricity|power|energy) (?:consumption|usage|bill)/i,
    action: (matches, navigate) => {
      navigate('/electricity');
      return 'Opening electricity monitor';
    }
  }
};

const VoiceControl = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [, navigate] = useLocation();
  const { devices, controlDevice } = useDevices();

  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript('Listening...');
        setIsAnimating(true);
      };

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        processCommand(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setFeedback(`Error: ${event.error}`);
        setShowFeedback(true);

        setTimeout(() => {
          setShowFeedback(false);
        }, 3000);
      };
    } else {
      // Speech recognition not supported
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Process transcript when speech recognition ends
  const processCommand = (text) => {
    if (!text || text === 'Listening...') return;

    // Check for command matches
    for (const [commandType, command] of Object.entries(VOICE_COMMANDS)) {
      const matches = text.match(command.regex);
      if (matches) {
        const response = command.action(matches, navigate, { devices, controlDevice });
        setFeedback(response);
        setShowFeedback(true);

        setTimeout(() => {
          setShowFeedback(false);
        }, 3000);

        return;
      }
    }

    // No command matched
    setFeedback("Sorry, I didn't understand that command");
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
    }, 3000);
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Speech recognition error', error);
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center md:fixed md:bottom-8 md:right-8">
      {/* Floating microphone button */}
      <button
        onClick={toggleListening}
        className={`floating-mic-button fixed z-50 flex items-center justify-center rounded-full shadow-lg ${
          isListening ? 'bg-red-500 scale-110' : 'bg-blue-600'
        } w-14 h-14 transition-all duration-300`}
      >
        {isListening ? (
          <MicOff className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}

        {/* Animated rings when active */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping-slow bg-red-500 opacity-30"></span>
            <span className="absolute inset-0 scale-125 rounded-full animate-ping-slow bg-red-500 opacity-20 delay-150"></span>
          </>
        )}
      </button>

      {/* Voice transcript overlay */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="fixed inset-x-0 bottom-24 z-40 px-4 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-[#1e1e2e] rounded-xl shadow-lg border border-gray-700 p-4 max-w-md w-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-white flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-red-500" />
                  Voice Command
                </h3>
                <button 
                  onClick={() => recognitionRef.current.stop()}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-3 bg-gray-800 rounded-lg text-gray-200 min-h-[40px]">
                {transcript}
              </div>

              <div className="mt-2 text-xs text-gray-400">
                Try saying: "Turn on living room lights" or "Go to dashboard"
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback toast */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-[#1e1e2e] text-white px-4 py-2 rounded-lg shadow-lg border border-gray-700">
              {feedback}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceControl;