import React from 'react';
import {
  PhoneOff,
  Monitor,
  Video,
  Mic,
  Headphones,
  Signal,
  MicOff } from
'lucide-react';
interface VoicePanelProps {
  channelName: string;
  serverName: string;
  onDisconnect: () => void;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
}
export function VoicePanel({
  channelName,
  serverName,
  onDisconnect,
  isMuted,
  isDeafened,
  onToggleMute,
  onToggleDeafen
}: VoicePanelProps) {
  return (
    <div className="bg-[#292b2f] border-b border-[#202225]">
      {/* Connection Info */}
      <div className="px-2 pt-2 pb-1">
        <div className="flex items-center justify-between text-[#43b581] mb-0.5">
          <div className="flex items-center font-bold text-xs">
            <Signal size={14} className="mr-1" />
            <span className={isDeafened ? 'text-[#f04747]' : 'text-[#43b581]'}>
              {isDeafened ? 'Voice Connected / Deafened' : 'Voice Connected'}
            </span>
          </div>
          <button
            onClick={onDisconnect}
            className="text-[#b9bbbe] hover:text-[#dcddde]"
            title="Disconnect">

            <PhoneOff size={16} />
          </button>
        </div>
        <div className="text-[#b9bbbe] text-xs truncate px-0.5">
          <span className="font-semibold text-white">{channelName}</span> /{' '}
          {serverName}
        </div>
      </div>

      {/* Voice Controls */}
      <div className="grid grid-cols-2 gap-1 px-2 pb-2">
        <button className="flex items-center justify-center py-1.5 rounded hover:bg-[#32353b] text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
          <Video size={18} className="mr-1.5" />
          <span className="text-xs font-medium">Video</span>
        </button>
        <button className="flex items-center justify-center py-1.5 rounded hover:bg-[#32353b] text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
          <Monitor size={18} className="mr-1.5" />
          <span className="text-xs font-medium">Screen</span>
        </button>
      </div>
    </div>);

}