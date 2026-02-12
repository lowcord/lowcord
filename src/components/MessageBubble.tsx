import React, { useState, useRef, Component } from 'react';
import { UserAvatar } from './UserAvatar';
import type { Message, Member } from '../App';
import {
  DownloadIcon,
  FileTextIcon,
  FileIcon,
  ImageIcon,
  FileAudioIcon,
  FileVideoIcon,
  PlayIcon,
  PauseIcon } from
'lucide-react';
interface MessageBubbleProps {
  message: Message;
  onAuthorClick: (member: Member, event: React.MouseEvent) => void;
}
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
function getFileIcon(type: string) {
  if (type.startsWith('image/')) return ImageIcon;
  if (type.startsWith('audio/')) return FileAudioIcon;
  if (type.startsWith('video/')) return FileVideoIcon;
  if (
  type.includes('pdf') ||
  type.includes('document') ||
  type.includes('text'))

  return FileTextIcon;
  return FileIcon;
}
function VoiceMessagePlayer({
  url,
  duration



}: {url: string;duration: number;}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audioRef.current.currentTime = percentage * duration;
    }
  };
  const progress = duration > 0 ? currentTime / duration * 100 : 0;
  return (
    <div className="flex items-center gap-3 bg-[#2f3136] rounded-lg px-3 py-2 min-w-64">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded} />

      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-[#5865f2] hover:bg-[#4752c4] flex items-center justify-center transition-colors flex-shrink-0">

        {isPlaying ?
        <PauseIcon className="w-5 h-5 text-white" /> :

        <PlayIcon className="w-5 h-5 text-white ml-0.5" />
        }
      </button>
      <div className="flex-1">
        <div
          onClick={handleSeek}
          className="h-1.5 bg-[#4f545c] rounded-full cursor-pointer relative overflow-hidden">

          <div
            className="absolute inset-y-0 left-0 bg-[#5865f2] rounded-full"
            style={{
              width: `${progress}%`
            }} />

          {/* Waveform visual (simplified) */}
          <div className="absolute inset-0 flex items-center justify-around px-1 opacity-30">
            {Array.from({
              length: 30
            }).map((_, i) =>
            <div
              key={i}
              className="w-0.5 bg-white rounded-full"
              style={{
                height: `${Math.random() * 100}%`
              }} />

            )}
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-[#8e9297]">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>);

}
function FileAttachment({
  attachment







}: {attachment: {name: string;size: number;url: string;type: string;};}) {
  const IconComponent = getFileIcon(attachment.type);
  const isImage = attachment.type.startsWith('image/');
  return (
    <div className="bg-[#2f3136] border border-[#202225] rounded-lg overflow-hidden max-w-sm">
      {isImage &&
      <img
        src={attachment.url}
        alt={attachment.name}
        className="max-w-full max-h-64 object-contain" />

      }
      <div className="flex items-center gap-3 p-3">
        <div className="w-10 h-10 rounded bg-[#5865f2] flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#00aff4] hover:underline cursor-pointer truncate text-sm font-medium">
            {attachment.name}
          </p>
          <p className="text-xs text-[#8e9297]">
            {formatFileSize(attachment.size)}
          </p>
        </div>
        <a
          href={attachment.url}
          download={attachment.name}
          className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors p-2"
          title="Download">

          <DownloadIcon className="w-5 h-5" />
        </a>
      </div>
    </div>);

}
export function MessageBubble({ message, onAuthorClick }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  return (
    <div className="flex gap-4 hover:bg-[#32353b] px-2 py-1 rounded group">
      <div
        className="cursor-pointer flex-shrink-0"
        onClick={(e) => onAuthorClick(message.author, e)}>

        <UserAvatar user={message.author} size="md" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span
            className="font-medium text-white hover:underline cursor-pointer"
            onClick={(e) => onAuthorClick(message.author, e)}>

            {message.author.displayName}
          </span>
          <span className="text-xs text-[#72767d]">
            {formatTime(message.timestamp)}
          </span>
        </div>

        {/* Text content */}
        {message.content &&
        <p className="text-[#dcddde] break-words">{message.content}</p>
        }

        {/* Voice message */}
        {message.voiceMessage &&
        <div className="mt-2">
            <VoiceMessagePlayer
            url={message.voiceMessage.url}
            duration={message.voiceMessage.duration} />

          </div>
        }

        {/* File attachments */}
        {message.attachments && message.attachments.length > 0 &&
        <div className="mt-2 space-y-2">
            {message.attachments.map((attachment, index) =>
          <FileAttachment key={index} attachment={attachment} />
          )}
          </div>
        }
      </div>
    </div>);

}