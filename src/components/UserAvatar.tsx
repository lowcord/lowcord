import React from 'react';
import type { Member } from '../App';
interface UserAvatarProps {
  user?: Member;
  username?: string;
  color?: string;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}
export function UserAvatar({
  user,
  username,
  color,
  status,
  size = 'md',
  showStatus = false,
  className
}: UserAvatarProps) {
  // Derive display values from either `user` object or individual props
  const displayName = user?.displayName || user?.username || username || '?';
  const avatarUrl = user?.avatar;
  const avatarColor = user?.avatarColor || color || '#5865f2';
  const userStatus = user?.status || status || 'offline';
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };
  const statusColors = {
    online: 'bg-[#3ba55c]',
    idle: 'bg-[#faa61a]',
    dnd: 'bg-[#ed4245]',
    offline: 'bg-[#747f8d]'
  };
  const statusSize = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };
  return (
    <div
      className={`relative inline-block ${sizeClasses[size]} ${className || ''}`}>

      <div
        className="rounded-full overflow-hidden w-full h-full flex items-center justify-center text-white font-medium"
        style={{
          backgroundColor: avatarColor
        }}>

        {avatarUrl ?
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-full h-full object-cover" /> :


        <span
          className={
          size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-2xl' : 'text-sm'
          }>

            {displayName.substring(0, 2).toUpperCase()}
          </span>
        }
      </div>

      {showStatus &&
      <div
        className={`absolute bottom-0 right-0 rounded-full border-[3px] border-[#2f3136] ${statusColors[userStatus]} ${statusSize[size]}`} />

      }
    </div>);

}