import React, { useState } from 'react';
import {
  ChevronDown,
  Hash,
  Volume2,
  Plus,
  Settings,
  Mic,
  Headphones,
  MicOff,
  Trash2,
  X } from
'lucide-react';
import { UserAvatar } from './UserAvatar';
import { VoicePanel } from './VoicePanel';
import { ServerDropdownMenu } from './ServerDropdownMenu';
import type { ConnectedVoiceState, Channel } from '../App';
interface ChannelProps {
  name: string;
  type: 'text' | 'voice';
  active?: boolean;
  connected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  connectedUsers?: Array<{
    username: string;
    avatarColor: string;
    isMuted?: boolean;
    isDeafened?: boolean;
  }>;
}
function ChannelItem({
  name,
  type,
  active,
  connected,
  onClick,
  onDelete,
  connectedUsers
}: ChannelProps) {
  return (
    <div className="mb-[1px]">
      <div
        onClick={onClick}
        className={`
          group flex items-center px-2 py-1 mx-2 rounded cursor-pointer relative
          ${active ? 'bg-[#393c43] text-white' : 'text-[#72767d] hover:bg-[#34373c] hover:text-[#dcddde]'}
        `}>

        {type === 'text' ?
        <Hash size={20} className="mr-1.5 flex-shrink-0 text-[#72767d]" /> :

        <Volume2 size={20} className="mr-1.5 flex-shrink-0 text-[#72767d]" />
        }
        <span
          className={`font-medium truncate flex-1 ${active || connected ? 'text-white' : ''}`}>

          {name}
        </span>

        {/* Settings/Delete Actions */}
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          {onDelete &&
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-[#b9bbbe] hover:text-[#f04747] p-1"
            title="Delete Channel">

              <Trash2 size={14} />
            </button>
          }
          <button className="text-[#b9bbbe] hover:text-[#dcddde] p-1">
            <Settings size={14} />
          </button>
        </div>
      </div>
      {/* Connected Users List for Voice Channels */}
      {connectedUsers && connectedUsers.length > 0 &&
      <div className="ml-8 mt-1 space-y-1 mb-2">
          {connectedUsers.map((user, i) =>
        <div
          key={i}
          className="flex items-center px-2 py-1 rounded hover:bg-[#34373c] cursor-pointer group/user">

              <UserAvatar
            username={user.username}
            color={user.avatarColor}
            size="sm"
            className="w-6 h-6 text-[10px] mr-2" />

              <span className="text-[#dcddde] text-sm truncate opacity-90 flex-1">
                {user.username}
              </span>
              {(user.isMuted || user.isDeafened) &&
          <div className="flex items-center text-[#f04747]">
                  {user.isDeafened ?
            <Headphones size={14} className="ml-1" /> :

            <MicOff size={14} className="ml-1" />
            }
                </div>
          }
            </div>
        )}
        </div>
      }
    </div>);

}
interface ChannelSidebarProps {
  server: {
    id: string;
    name: string;
    channels: Array<{
      id: string;
      name: string;
      type: 'text' | 'voice';
    }>;
  };
  selectedChannel: {
    id: string;
    name: string;
    type: 'text' | 'voice';
  } | null;
  onSelectChannel: (channel: {
    id: string;
    name: string;
    type: 'text' | 'voice';
  }) => void;
  currentUser: {
    id: string;
    username: string;
    discriminator: string;
    avatarColor: string;
    displayName: string;
  };
  onOpenSettings: () => void;
  onAddChannel: () => void;
  onDeleteChannel: (channelId: string) => void;
  onOpenServerSettings: () => void;
  // Voice Props
  connectedVoice: ConnectedVoiceState | null;
  onJoinVoice: (channel: Channel) => void;
  onLeaveVoice: () => void;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  onProfileClick?: (e: React.MouseEvent) => void;
}
export function ChannelSidebar({
  server,
  selectedChannel,
  onSelectChannel,
  currentUser,
  onOpenSettings,
  onAddChannel,
  onDeleteChannel,
  onOpenServerSettings,
  connectedVoice,
  onJoinVoice,
  onLeaveVoice,
  isMuted,
  isDeafened,
  onToggleMute,
  onToggleDeafen,
  onProfileClick
}: ChannelSidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textChannels = server.channels.filter((c) => c.type === 'text');
  const voiceChannels = server.channels.filter((c) => c.type === 'voice');
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col relative">
      {/* Server Header */}
      <div
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`h-12 px-4 flex items-center justify-between border-b border-[#202225] shadow-sm hover:bg-[#34373c] cursor-pointer transition-colors ${isMenuOpen ? 'bg-[#34373c]' : ''}`}>

        <span className="font-semibold text-white truncate">{server.name}</span>
        {isMenuOpen ?
        <X size={20} className="text-white" /> :

        <ChevronDown size={20} className="text-white" />
        }
      </div>

      <ServerDropdownMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        serverId={server.id}
        currentUser={currentUser}
        onServerSettings={onOpenServerSettings}
        onCreateChannel={onAddChannel}
        onCreateCategory={() => console.log('Create Category')}
        onNotificationSettings={() => console.log('Notification Settings')}
        onPrivacySettings={() => console.log('Privacy Settings')}
        onEditServerProfile={() => console.log('Edit Server Profile')}
        onLeaveServer={() => console.log('Leave Server')}
        isOwner={true} />


      {/* Channels List */}
      <div className="flex-1 overflow-y-auto pt-4 custom-scrollbar">
        {/* Text Channels */}
        <div className="px-2 mb-4">
          <div className="flex items-center justify-between px-2 mb-1 group">
            <span className="text-xs font-semibold text-[#8e9297] uppercase tracking-wide">
              Text Channels
            </span>
            <button
              onClick={onAddChannel}
              className="text-[#8e9297] hover:text-[#dcddde] opacity-0 group-hover:opacity-100 transition-opacity"
              title="Create Channel">

              <Plus size={14} className="ml-auto cursor-pointer" />
            </button>
          </div>
          {textChannels.length === 0 ?
          <div className="px-2 py-4 text-center">
              <p className="text-sm text-[#8e9297] mb-2">
                No text channels yet
              </p>
              <button
              onClick={onAddChannel}
              className="text-xs text-[#00aff4] hover:underline">

                Create your first channel
              </button>
            </div> :

          textChannels.map((channel) =>
          <ChannelItem
            key={channel.id}
            name={channel.name}
            type="text"
            active={selectedChannel?.id === channel.id}
            onClick={() => onSelectChannel(channel)}
            onDelete={() => onDeleteChannel(channel.id)} />

          )
          }
        </div>

        {/* Voice Channels */}
        <div className="px-2">
          <div className="flex items-center justify-between px-2 mb-1 group">
            <span className="text-xs font-semibold text-[#8e9297] uppercase tracking-wide">
              Voice Channels
            </span>
            <button
              onClick={onAddChannel}
              className="text-[#8e9297] hover:text-[#dcddde] opacity-0 group-hover:opacity-100 transition-opacity"
              title="Create Channel">

              <Plus size={14} className="ml-auto cursor-pointer" />
            </button>
          </div>
          {voiceChannels.length === 0 ?
          <div className="px-2 py-4 text-center">
              <p className="text-sm text-[#8e9297] mb-2">
                No voice channels yet
              </p>
              <button
              onClick={onAddChannel}
              className="text-xs text-[#00aff4] hover:underline">

                Create your first channel
              </button>
            </div> :

          voiceChannels.map((channel) =>
          <ChannelItem
            key={channel.id}
            name={channel.name}
            type="voice"
            active={false}
            connected={connectedVoice?.channelId === channel.id}
            onClick={() => onJoinVoice(channel)}
            onDelete={() => onDeleteChannel(channel.id)}
            connectedUsers={
            connectedVoice?.channelId === channel.id ?
            [
            {
              username: currentUser.username,
              avatarColor: currentUser.avatarColor,
              isMuted,
              isDeafened
            }] :

            []
            } />

          )
          }
        </div>
      </div>

      {/* Voice Panel (if connected) */}
      {connectedVoice &&
      <VoicePanel
        channelName={connectedVoice.channelName}
        serverName={connectedVoice.serverName}
        onDisconnect={onLeaveVoice}
        isMuted={isMuted}
        isDeafened={isDeafened}
        onToggleMute={onToggleMute}
        onToggleDeafen={onToggleDeafen} />

      }

      {/* User Panel */}
      <div className="h-[52px] bg-[#292b2f] px-2 flex items-center gap-2 flex-shrink-0">
        <div
          onClick={onProfileClick}
          className="flex items-center gap-2 flex-1 min-w-0 rounded px-1 py-0.5 cursor-pointer hover:bg-[#36393f] transition-colors">

          <UserAvatar user={currentUser} size="sm" showStatus />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {currentUser.displayName}
            </p>
            <p className="text-xs text-[#b9bbbe] truncate">
              #{currentUser.discriminator}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded transition-colors relative ${isMuted || isDeafened ? 'text-[#f04747] hover:bg-[#36393f]' : 'text-[#b9bbbe] hover:text-[#dcddde] hover:bg-[#36393f]'}`}
            title={isMuted ? 'Unmute' : 'Mute'}>

            {isMuted || isDeafened ? <MicOff size={18} /> : <Mic size={18} />}
            {isDeafened &&
            <div className="absolute inset-0 bg-red-500/10 rounded" />
            }
          </button>
          <button
            onClick={onToggleDeafen}
            className={`p-1.5 rounded transition-colors relative ${isDeafened ? 'text-[#f04747] hover:bg-[#36393f]' : 'text-[#b9bbbe] hover:text-[#dcddde] hover:bg-[#36393f]'}`}
            title={isDeafened ? 'Undeafen' : 'Deafen'}>

            {isDeafened ?
            <Headphones size={18} className="relative z-10" /> :

            <Headphones size={18} />
            }
            {isDeafened &&
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-[#f04747] rotate-45" />
            }
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-[#b9bbbe] hover:text-[#dcddde] hover:bg-[#36393f] rounded transition-colors">

            <Settings size={18} />
          </button>
        </div>
      </div>
    </div>);

}