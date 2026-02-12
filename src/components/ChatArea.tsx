import React, { useEffect, useState, useRef } from 'react';
import {
  HashIcon,
  BellIcon,
  PinIcon,
  UsersIcon,
  SearchIcon,
  InboxIcon,
  HelpCircleIcon,
  PlusCircleIcon,
  GiftIcon,
  StickerIcon,
  SmileIcon,
  SendIcon,
  PaperclipIcon,
  MicIcon,
  SquareIcon,
  XIcon,
  FileIcon,
  AtSignIcon } from
'lucide-react';
import { MessageBubble } from './MessageBubble';
import { WumpusEmptyState } from './WumpusEmptyState';
import type { Channel, Message, Member } from '../App';
import { motion, AnimatePresence } from 'framer-motion';
interface ChatAreaProps {
  channel: Channel | null;
  messages: Message[];
  onSendMessage: (
  content: string,
  attachments?: {
    name: string;
    size: number;
    url: string;
    type: string;
  }[],
  voiceMessage?: {
    url: string;
    duration: number;
  })
  => void;
  currentUser: Member;
  onMemberClick: (member: Member, event: React.MouseEvent) => void;
  showMemberList: boolean;
  onToggleMemberList: () => void;
  isDM?: boolean;
}
export function ChatArea({
  channel,
  messages,
  onSendMessage,
  currentUser,
  onMemberClick,
  showMemberList,
  onToggleMemberList,
  isDM = false
}: ChatAreaProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // File upload state
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  // Cleanup recording interval on unmount
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);
  const handleSend = () => {
    if (messageInput.trim() || attachedFiles.length > 0) {
      // Convert files to blob URLs
      const attachments = attachedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      onSendMessage(
        messageInput.trim(),
        attachments.length > 0 ? attachments : undefined
      );
      setMessageInput('');
      setAttachedFiles([]);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles((prev) => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      // Wait for the data to be available
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm'
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSendMessage('', undefined, {
          url: audioUrl,
          duration: recordingDuration
        });
        setIsRecording(false);
        setRecordingDuration(0);
        audioChunksRef.current = [];
      };
    }
  };
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setIsRecording(false);
      setRecordingDuration(0);
      audioChunksRef.current = [];
    }
  };
  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#36393f]">
        <WumpusEmptyState type="no-channel" />
      </div>);

  }
  return (
    <div className="flex-1 flex flex-col bg-[#36393f]">
      {/* Channel Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-[#202225] shadow-sm">
        <div className="flex items-center gap-2">
          {isDM ?
          <AtSignIcon className="w-5 h-5 text-[#8e9297]" /> :

          <HashIcon className="w-5 h-5 text-[#8e9297]" />
          }
          <span className="font-semibold text-white">{channel.name}</span>
          {channel.description &&
          <>
              <div className="w-px h-6 bg-[#4f545c] mx-2" />
              <span className="text-sm text-[#8e9297] truncate max-w-md">
                {channel.description}
              </span>
            </>
          }
        </div>
        <div className="flex items-center gap-4">
          {!isDM &&
          <>
              <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
                <HashIcon className="w-5 h-5" />
              </button>
              <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
                <BellIcon className="w-5 h-5" />
              </button>
              <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
                <PinIcon className="w-5 h-5" />
              </button>
              <button
              onClick={onToggleMemberList}
              className={`transition-colors ${showMemberList ? 'text-white' : 'text-[#b9bbbe] hover:text-[#dcddde]'}`}>

                <UsersIcon className="w-5 h-5" />
              </button>
            </>
          }
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-36 bg-[#202225] text-sm text-[#dcddde] placeholder-[#72767d] rounded px-2 py-1 focus:outline-none focus:w-56 transition-all" />

            <SearchIcon className="w-4 h-4 text-[#72767d] absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
          <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
            <InboxIcon className="w-5 h-5" />
          </button>
          <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
            <HelpCircleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ?
        <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-[#5865f2] rounded-full flex items-center justify-center mb-4">
              {isDM ?
            <AtSignIcon className="w-8 h-8 text-white" /> :

            <HashIcon className="w-8 h-8 text-white" />
            }
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isDM ?
            `This is the beginning of your direct message history with @${channel.name}.` :
            `Welcome to #${channel.name}!`}
            </h2>
            <p className="text-[#8e9297]">
              {isDM ?
            `Say hello to @${channel.name}!` :
            `This is the start of the #${channel.name} channel.`}
            </p>
          </div> :

        messages.map((message) =>
        <MessageBubble
          key={message.id}
          message={message}
          onAuthorClick={onMemberClick} />

        )
        }
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview Bar */}
      <AnimatePresence>
        {attachedFiles.length > 0 &&
        <motion.div
          initial={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: 'auto',
            opacity: 1
          }}
          exit={{
            height: 0,
            opacity: 0
          }}
          className="px-4 bg-[#2f3136] border-t border-[#202225]">

            <div className="py-2 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) =>
            <div
              key={index}
              className="flex items-center gap-2 bg-[#36393f] rounded px-3 py-2 text-sm">

                  <FileIcon className="w-4 h-4 text-[#b9bbbe]" />
                  <span className="text-[#dcddde] max-w-32 truncate">
                    {file.name}
                  </span>
                  <span className="text-[#72767d]">
                    ({formatFileSize(file.size)})
                  </span>
                  <button
                onClick={() => removeAttachedFile(index)}
                className="text-[#b9bbbe] hover:text-red-400 transition-colors">

                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
            )}
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Message Input */}
      <div className="px-4 pb-6">
        <div className="bg-[#40444b] rounded-lg">
          {isRecording /* Recording UI */ ?
          <div className="flex items-center gap-4 px-4 py-3">
              <motion.div
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                repeat: Infinity,
                duration: 1
              }}
              className="w-3 h-3 bg-red-500 rounded-full" />

              <span className="text-red-400 font-medium">Recording</span>
              <span className="text-[#dcddde] font-mono">
                {formatDuration(recordingDuration)}
              </span>
              <div className="flex-1" />
              <button
              onClick={cancelRecording}
              className="text-[#b9bbbe] hover:text-red-400 transition-colors p-2"
              title="Cancel">

                <XIcon className="w-5 h-5" />
              </button>
              <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors"
              title="Stop and Send">

                <SquareIcon className="w-4 h-4" />
              </button>
            </div> /* Normal Input UI */ :

          <div className="flex items-center gap-2 px-4">
              <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors p-2"
              title="Attach files">

                <PaperclipIcon className="w-5 h-5" />
              </button>
              <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden" />

              <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${isDM ? '@' + channel.name : '#' + channel.name}`}
              className="flex-1 bg-transparent text-[#dcddde] placeholder-[#72767d] py-3 focus:outline-none" />

              <div className="flex items-center gap-1">
                <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors p-2">
                  <GiftIcon className="w-5 h-5" />
                </button>
                <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors p-2">
                  <StickerIcon className="w-5 h-5" />
                </button>
                <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors p-2">
                  <SmileIcon className="w-5 h-5" />
                </button>
                <button
                onClick={startRecording}
                className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors p-2"
                title="Record voice message">

                  <MicIcon className="w-5 h-5" />
                </button>
                {(messageInput.trim() || attachedFiles.length > 0) &&
              <button
                onClick={handleSend}
                className="text-[#5865f2] hover:text-[#4752c4] transition-colors p-2">

                    <SendIcon className="w-5 h-5" />
                  </button>
              }
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}