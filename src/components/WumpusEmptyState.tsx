import React from 'react';
import { HashIcon, UsersIcon, ServerIcon } from 'lucide-react';
interface WumpusEmptyStateProps {
  type:
  'no-friends' |
  'no-online' |
  'no-pending' |
  'no-blocked' |
  'no-channel' |
  'no-servers';
}
export function WumpusEmptyState({ type }: WumpusEmptyStateProps) {
  const content = {
    'no-friends': {
      title: "Wumpus is waiting on friends. You don't have to though!",
      subtitle: 'You can add friends by their username.',
      icon: UsersIcon
    },
    'no-online': {
      title: "No one's around to play with Wumpus.",
      subtitle: "When your friends come online, they'll appear here.",
      icon: UsersIcon
    },
    'no-pending': {
      title: "There are no pending friend requests. Here's Wumpus for now.",
      subtitle: 'Send a friend request to get started!',
      icon: UsersIcon
    },
    'no-blocked': {
      title: "You can't unblock the Wumpus.",
      subtitle: 'Your blocked users will appear here.',
      icon: UsersIcon
    },
    'no-channel': {
      title: 'No Text Channels',
      subtitle:
      "You find yourself in a strange place. You don't have access to any text channels, or there are none in this server.",
      icon: HashIcon
    },
    'no-servers': {
      title: 'Welcome to your new Discord!',
      subtitle:
      'Create your first server to start chatting with friends. Click the + button in the sidebar to get started.',
      icon: ServerIcon
    }
  };
  const { title, subtitle, icon: Icon } = content[type];
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 py-16">
      {/* Wumpus illustration placeholder */}
      <div className="w-48 h-48 mb-8 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-[#5865f2]/20 rounded-full flex items-center justify-center">
            <Icon className="w-16 h-16 text-[#5865f2]" />
          </div>
        </div>
        {/* Simple Wumpus-like character */}
        <svg viewBox="0 0 200 200" className="w-full h-full opacity-50">
          <ellipse
            cx="100"
            cy="130"
            rx="60"
            ry="50"
            fill="#5865f2"
            opacity="0.3" />

          <circle cx="80" cy="100" r="12" fill="#202225" />
          <circle cx="120" cy="100" r="12" fill="#202225" />
          <circle cx="84" cy="96" r="4" fill="white" />
          <circle cx="124" cy="96" r="4" fill="white" />
        </svg>
      </div>
      <h3 className="text-[#8e9297] font-medium mb-2">{title}</h3>
      <p className="text-[#72767d] text-sm max-w-md">{subtitle}</p>
    </div>);

}