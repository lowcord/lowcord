import React from 'react';
import { MessageSquare, MoreVertical, Phone } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
interface FriendRowProps {
  username: string;
  discriminator: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  statusText?: string;
  avatarColor?: string;
  onMessage?: () => void;
}
export function FriendRow({
  username,
  discriminator,
  status,
  statusText,
  avatarColor,
  onMessage
}: FriendRowProps) {
  return (
    <div className="group flex items-center justify-between p-2.5 px-3 hover:bg-[#32353b] hover:rounded-lg cursor-pointer border-t border-[#42454a] first:border-t-0 mx-2 mt-[1px]">
      <div className="flex items-center space-x-3">
        <UserAvatar
          username={username}
          status={status}
          color={avatarColor}
          className="flex-shrink-0" />

        <div className="flex flex-col">
          <div className="flex items-baseline">
            <span className="text-white font-semibold mr-1">{username}</span>
            <span className="text-[#72767d] text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              #{discriminator}
            </span>
          </div>
          <span className="text-[#72767d] text-xs font-medium">
            {statusText || status}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMessage?.();
          }}
          className="w-9 h-9 rounded-full bg-[#2f3136] flex items-center justify-center text-[#b9bbbe] hover:text-[#dcddde] transition-colors"
          title="Message">

          <MessageSquare
            size={18}
            fill="currentColor"
            className="text-[#b9bbbe]" />

        </button>
        <button
          className="w-9 h-9 rounded-full bg-[#2f3136] flex items-center justify-center text-[#b9bbbe] hover:text-[#dcddde] transition-colors"
          title="Start Voice Call">

          <Phone size={18} fill="currentColor" className="text-[#b9bbbe]" />
        </button>
        <button
          className="w-9 h-9 rounded-full bg-[#2f3136] flex items-center justify-center text-[#b9bbbe] hover:text-[#dcddde] transition-colors"
          title="More">

          <MoreVertical size={18} />
        </button>
      </div>
    </div>);

}