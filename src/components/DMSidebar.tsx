import React, { useEffect, useState } from 'react';
import {
  UsersIcon,
  SettingsIcon,
  MicIcon,
  HeadphonesIcon,
  MicOffIcon,
  X } from
'lucide-react';
import { UserAvatar } from './UserAvatar';
import { VoicePanel } from './VoicePanel';
import type { Member, ConnectedVoiceState } from '../App';
import { db, syncChannel, StoredUser } from '../lib/database';
interface DMSidebarProps {
  currentUser: Member;
  onOpenSettings: () => void;
  isMuted: boolean;
  isDeafened: boolean;
  onToggleMute: () => void;
  onToggleDeafen: () => void;
  connectedVoice: ConnectedVoiceState | null;
  onDisconnect: () => void;
  onProfileClick?: (e: React.MouseEvent) => void;
  selectedDMUserId: string | null;
  onSelectDM: (userId: string) => void;
}
export function DMSidebar({
  currentUser,
  onOpenSettings,
  isMuted,
  isDeafened,
  onToggleMute,
  onToggleDeafen,
  connectedVoice,
  onDisconnect,
  onProfileClick,
  selectedDMUserId,
  onSelectDM
}: DMSidebarProps) {
  const [friends, setFriends] = useState<StoredUser[]>([]);
  const refreshFriends = () => {
    setFriends(db.getFriends(currentUser.id));
  };
  useEffect(() => {
    refreshFriends();
    const handleSync = (event: MessageEvent) => {
      if (
      event.data.type === 'friends_updated' ||
      event.data.type === 'users_updated')
      {
        refreshFriends();
      }
    };
    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, [currentUser]);
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      {/* Search/Find Bar */}
      <div className="h-12 px-2 flex items-center shadow-sm border-b border-[#202225]">
        <button className="w-full text-left px-2 py-1 rounded bg-[#202225] text-[#949ba4] text-sm hover:text-[#dcddde] transition-colors">
          Find or start a conversation
        </button>
      </div>

      {/* Friends Button */}
      <div className="px-2 pt-2">
        <button
          onClick={() => onSelectDM('')}
          className={`w-full flex items-center gap-3 px-2 py-2 rounded transition-colors ${!selectedDMUserId ? 'bg-[#393c43] text-white' : 'text-[#949ba4] hover:bg-[#36393f] hover:text-[#dcddde]'}`}>

          <UsersIcon className="w-5 h-5" />
          <span className="font-medium">Friends</span>
        </button>
      </div>

      {/* Direct Messages List */}
      <div className="flex-1 overflow-y-auto pt-4 px-2 custom-scrollbar">
        <div className="flex items-center justify-between px-2 mb-1 group">
          <span className="text-xs font-semibold text-[#8e9297] uppercase tracking-wide">
            Direct Messages
          </span>
          <button className="text-[#8e9297] hover:text-[#dcddde] opacity-0 group-hover:opacity-100 transition-opacity">
            +
          </button>
        </div>

        <div className="mt-2 space-y-1">
          {friends.length === 0 ?
          <div className="text-center mt-8">
              <div className="w-32 h-32 mx-auto mb-2 opacity-10">
                <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full text-white">

                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </div>
              <p className="text-sm text-[#72767d]">
                Wumpus is waiting for friends.
              </p>
            </div> :

          friends.map((friend) =>
          <div
            key={friend.id}
            onClick={() => onSelectDM(friend.id)}
            className={`flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer group ${selectedDMUserId === friend.id ? 'bg-[#393c43] text-white' : 'text-[#949ba4] hover:bg-[#36393f] hover:text-[#dcddde]'}`}>

                <UserAvatar user={friend} size="sm" showStatus />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{friend.username}</div>
                  <div className="text-xs truncate opacity-60">
                    {friend.status}
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 hover:text-white">
                  <X size={14} />
                </button>
              </div>
          )
          }
        </div>
      </div>

      {/* Voice Panel (if connected) */}
      {connectedVoice &&
      <VoicePanel
        channelName={connectedVoice.channelName}
        serverName={connectedVoice.serverName}
        onDisconnect={onDisconnect}
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

            {isMuted || isDeafened ?
            <MicOffIcon size={18} /> :

            <MicIcon size={18} />
            }
          </button>
          <button
            onClick={onToggleDeafen}
            className={`p-1.5 rounded transition-colors relative ${isDeafened ? 'text-[#f04747] hover:bg-[#36393f]' : 'text-[#b9bbbe] hover:text-[#dcddde] hover:bg-[#36393f]'}`}
            title={isDeafened ? 'Undeafen' : 'Deafen'}>

            <HeadphonesIcon size={18} />
            {isDeafened &&
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-[#f04747] rotate-45" />
            }
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-[#b9bbbe] hover:text-[#dcddde] hover:bg-[#36393f] rounded transition-colors">

            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>);

}