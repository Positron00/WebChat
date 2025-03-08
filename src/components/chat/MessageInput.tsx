'use client';

import React, { useRef, useState, useEffect } from 'react';
import { MicrophoneIcon, PaperClipIcon, ComputerDesktopIcon, SparklesIcon, PaperAirplaneIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useApp } from '@/contexts/AppContext';
import path from 'path';
import { saveAs } from 'file-saver';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  disabled?: boolean;
  onNewChat?: () => void;
  screenshotActive?: boolean;
  onClearScreenshot?: () => void;
  imagePreviewUrl?: string | null;
}

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const PROMPT_STYLES = {
  balanced: 'Balanced',
  creative: 'Creative',
  precise: 'Precise',
  helpful: 'Helpful',
  verbose: 'Verbose',
  concise: 'Concise'
};

// Define colors for each prompt style
const PROMPT_STYLE_COLORS = {
  balanced: 'bg-indigo-600 text-white',
  creative: 'bg-purple-600 text-white',
  precise: 'bg-blue-600 text-white',
  helpful: 'bg-green-600 text-white',
  verbose: 'bg-amber-600 text-white',
  concise: 'bg-rose-600 text-white'
};

// Define knowledge focus areas
const KNOWLEDGE_FOCUS = {
  general: 'General',
  medical: 'Medical',
  legal: 'Legal',
  science: 'Science',
  technology: 'Technology',
  business: 'Business',
  history: 'History'
};

// Define colors for knowledge focus areas
const KNOWLEDGE_FOCUS_COLORS = {
  general: 'bg-gray-600 text-white',
  medical: 'bg-red-600 text-white',
  legal: 'bg-yellow-600 text-white',
  science: 'bg-teal-700 text-white',
  technology: 'bg-cyan-700 text-white',
  business: 'bg-amber-700 text-white',
  history: 'bg-orange-700 text-white'
};

// Define Speech Recognition type for TypeScript
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
}

interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

// Browser compatibility type for Speech Recognition
interface Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onFileSelect,
  isLoading,
  disabled = false,
  onNewChat,
  screenshotActive = false,
  onClearScreenshot,
  imagePreviewUrl
}: MessageInputProps) {
  const { isOffline, accessibility, setAccessibility } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showFocusDropdown, setShowFocusDropdown] = useState(false);
  const [isCapturingScreen, setIsCapturingScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    console.log('Initializing speech recognition');
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      setSpeechRecognition(recognition);
    } else {
      console.warn('Speech recognition is not supported in this browser');
    }
    
    return () => {
      // No cleanup needed for initialization
    };
  }, []);  // Empty dependency array since this only needs to run once

  // Set up event listeners for speech recognition
  useEffect(() => {
    if (!speechRecognition) return;
    
    console.log('Setting up speech recognition event listeners');
    
    // Handle speech recognition results
    const handleSpeechResult = (event: any) => {
      console.log('Speech recognition result received', event.results);
      const results = event.results;
      
      if (results.length > 0) {
        // Get the latest result
        const latest = results[results.length - 1];
        
        // Extract transcript
        const transcript = latest[0].transcript;
        console.log('Transcript:', transcript, 'Final:', latest.isFinal);
        
        if (latest.isFinal) {
          console.log('Updating input with final transcript:', transcript);
          // Add space only if there's existing text
          const newValue = value ? `${value} ${transcript}` : transcript;
          onChange(newValue);
        }
      }
    };
    
    // Handle speech recognition errors
    const handleSpeechError = (error: any) => {
      console.error('Speech recognition error:', error);
      setIsRecording(false);
    };
    
    // Handle speech recognition end
    const handleSpeechEnd = () => {
      console.log('Speech recognition ended');
      setIsRecording(false);
    };
    
    // Configure event listeners
    speechRecognition.addEventListener('result', handleSpeechResult);
    speechRecognition.addEventListener('error', handleSpeechError);
    speechRecognition.addEventListener('end', handleSpeechEnd);
    
    // Clean up event listeners
    return () => {
      console.log('Cleaning up speech recognition event listeners');
      speechRecognition.removeEventListener('result', handleSpeechResult);
      speechRecognition.removeEventListener('error', handleSpeechError);
      speechRecognition.removeEventListener('end', handleSpeechEnd);
      
      if (isRecording) {
        speechRecognition.stop();
      }
    };
  }, [speechRecognition, onChange, value, isRecording]); // Include all dependencies

  // Toggle voice recording
  const toggleVoiceRecording = () => {
    console.log('Toggle voice recording, current state:', isRecording);
    if (!speechRecognition) {
      alert('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
      return;
    }
    
    if (isRecording) {
      console.log('Stopping speech recognition');
      speechRecognition.stop();
      setIsRecording(false);
    } else {
      try {
        console.log('Starting speech recognition');
        speechRecognition.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        alert('Failed to start speech recognition. Please try again.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
  };

  const toggleHighContrast = () => {
    setAccessibility({
      ...accessibility,
      highContrast: !accessibility.highContrast
    });
  };

  const changePromptStyle = (style: 'balanced' | 'creative' | 'precise' | 'helpful' | 'verbose' | 'concise') => {
    setAccessibility({
      ...accessibility,
      promptStyle: style
    });
  };

  const changeKnowledgeFocus = (focus: 'general' | 'medical' | 'legal' | 'science' | 'technology' | 'business' | 'history') => {
    setAccessibility({
      ...accessibility,
      knowledgeFocus: focus
    });
    setShowFocusDropdown(false);
  };

  const captureScreen = async () => {
    try {
      setIsCapturingScreen(true);
      
      // Request screen capture permission and stream
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      
      // Create video element to capture the stream
      const video = document.createElement('video');
      video.srcObject = mediaStream;
      
      // Wait for video metadata to load
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });
      
      // Create canvas to draw the captured frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame to canvas
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Stop all tracks in the stream
      mediaStream.getTracks().forEach(track => track.stop());
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else throw new Error('Failed to create screenshot blob');
        }, 'image/png');
      });
      
      // Create file with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `screenshot-${timestamp}.png`;
      
      // Create a File object
      const file = new File([blob], fileName, { type: 'image/png' });
      
      // Save the file
      saveAs(blob, fileName);
      
      // Use the existing onFileSelect handler to add the screenshot to the chat
      onFileSelect(file);
      
    } catch (error) {
      console.error('Error capturing screen:', error);
      alert('Failed to capture screen. Please ensure you have granted screen capture permissions.');
    } finally {
      setIsCapturingScreen(false);
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="relative">
        {/* Mini-preview of attached image */}
        {imagePreviewUrl && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center">
            <div className="relative">
              <img 
                src={imagePreviewUrl} 
                alt="Attached image" 
                className="w-8 h-8 object-cover rounded"
              />
              {onClearScreenshot && (
                <button
                  onClick={onClearScreenshot}
                  className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-0.5 hover:bg-gray-700"
                  aria-label="Remove attached image"
                >
                  <XMarkIcon className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Input field with adjusted padding if image is present */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Just ask..."
          className={`w-full py-3 pr-48 bg-gray-950 border border-white/10 rounded-full outline-none text-white placeholder-gray-500 disabled:opacity-50 transition-all ${
            imagePreviewUrl ? 'pl-14' : 'pl-3'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !disabled) {
              e.preventDefault();
              onSubmit();
            }
          }}
          rows={1}
          disabled={disabled || isRecording}
        />

        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-black font-medium rounded-full p-2 disabled:opacity-50 disabled:pointer-events-none"
          disabled={!value.trim() && !imagePreviewUrl || isLoading || disabled}
          onClick={onSubmit}
          aria-label="Submit message"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mt-1">
        {/* Left side buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
            disabled={isOffline}
          >
            <PaperClipIcon className="w-3 h-3 text-gray-300" />
            <span className="text-xs text-gray-300">Attach</span>
          </button>

          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px] ${isRecording ? 'bg-red-600 text-white' : ''}`}
            disabled={isOffline}
            aria-label={isRecording ? "Stop recording" : "Start voice recording"}
          >
            <MicrophoneIcon className={`w-3 h-3 ${isRecording ? 'text-white animate-pulse' : 'text-gray-300'}`} />
            <span className={`text-xs ${isRecording ? 'text-white' : 'text-gray-300'}`}>
              {isRecording ? 'Recording...' : 'Voice'}
            </span>
          </button>

          <button
            type="button"
            className={`p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px] ${screenshotActive ? 'bg-white/10' : ''}`}
            onClick={screenshotActive ? onClearScreenshot : captureScreen}
            disabled={isCapturingScreen || isOffline}
            aria-label={screenshotActive ? "Clear screenshot" : "Capture screenshot"}
          >
            <ComputerDesktopIcon className="w-3 h-3 text-gray-300" />
            <span className="text-xs text-gray-300">
              {isCapturingScreen ? 'Capturing...' : screenshotActive ? 'Clear Screen' : 'Screen'}
            </span>
          </button>
          
          {/* Prompt Style Pill */}
          <div 
            className={`px-2 py-0.5 rounded-full text-xs ${PROMPT_STYLE_COLORS[accessibility.promptStyle]}`}
            aria-label={`Current AI style: ${PROMPT_STYLES[accessibility.promptStyle]}`}
          >
            {PROMPT_STYLES[accessibility.promptStyle]}
          </div>
          
          {/* Knowledge Focus Pill */}
          <div 
            className={`px-2 py-0.5 rounded-full text-xs ${KNOWLEDGE_FOCUS_COLORS[accessibility.knowledgeFocus]}`}
            aria-label={`Knowledge focus: ${KNOWLEDGE_FOCUS[accessibility.knowledgeFocus]}`}
          >
            {KNOWLEDGE_FOCUS[accessibility.knowledgeFocus]}
          </div>
        </div>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {/* Focus button and dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFocusDropdown(!showFocusDropdown)}
              className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
            >
              <SparklesIcon className="w-3 h-3 text-gray-300" />
              <span className="text-xs text-gray-300">Focus</span>
            </button>
            
            {/* Focus Dropdown */}
            {showFocusDropdown && (
              <div className="absolute bottom-8 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 min-w-[200px] z-10">
                <h4 className="text-white text-sm font-medium mb-2">Knowledge Focus</h4>
                <div className="space-y-2">
                  {Object.entries(KNOWLEDGE_FOCUS).map(([focus, label]) => (
                    <div key={focus} className="flex items-center">
                      <input
                        type="radio"
                        id={`focus-${focus}`}
                        name="knowledgeFocus"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        checked={accessibility.knowledgeFocus === focus}
                        onChange={() => changeKnowledgeFocus(focus as any)}
                      />
                      <label htmlFor={`focus-${focus}`} className="ml-2 text-xs font-medium text-gray-300">
                        {label}
                      </label>
                    </div>
                  ))}
                  <p className="text-gray-400 text-xs mt-2">
                    Select a knowledge domain for AI responses
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Settings Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
              aria-expanded={showSettings}
              aria-haspopup="true"
              aria-label="Settings"
            >
              <Cog6ToothIcon className="w-3 h-3 text-gray-300" />
              <span className="text-xs text-gray-300">Settings</span>
            </button>
            
            {/* Settings Dropdown */}
            {showSettings && (
              <div className="absolute bottom-8 right-0 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 min-w-[200px] z-10">
                {/* High Contrast Setting */}
                <div className="p-2 border-b border-gray-700">
                  <h4 className="text-white text-sm font-medium mb-2">Appearance</h4>
                  <div className="flex items-center justify-between">
                    <label htmlFor="high-contrast-toggle" className="text-gray-300 text-xs">
                      Darker Background
                    </label>
                    <button
                      id="high-contrast-toggle"
                      onClick={toggleHighContrast}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full ${
                        accessibility.highContrast ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                      aria-pressed={accessibility.highContrast}
                      aria-label="Toggle darker background mode"
                    >
                      <span
                        className={`${
                          accessibility.highContrast ? 'translate-x-5' : 'translate-x-1'
                        } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                      />
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    Changes the background color of message bubbles for better readability
                  </p>
                </div>
                
                {/* Prompt Style Setting */}
                <div className="p-2">
                  <h4 className="text-white text-sm font-medium mb-2">AI Response Style</h4>
                  <div className="space-y-2">
                    {Object.entries(PROMPT_STYLES).map(([style, label]) => (
                      <div key={style} className="flex items-center">
                        <input
                          type="radio"
                          id={`style-${style}`}
                          name="promptStyle"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={accessibility.promptStyle === style}
                          onChange={() => changePromptStyle(style as any)}
                        />
                        <label htmlFor={`style-${style}`} className="ml-2 text-xs font-medium text-gray-300">
                          {label}
                        </label>
                      </div>
                    ))}
                    <p className="text-gray-400 text-xs mt-2">
                      Select how you want the AI to respond to your messages
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {onNewChat && (
            <button
              type="button"
              onClick={onNewChat}
              className="p-1 hover:bg-white/5 rounded transition-colors flex items-center gap-0.5 text-[10px]"
              aria-label="Start a new chat"
            >
              <span className="text-xs text-gray-300">New Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept={ALLOWED_FILE_TYPES.join(',')}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload Image"
        disabled={isOffline}
      />
    </div>
  );
} 