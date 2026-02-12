import React, { useEffect, useState, useRef } from 'react';
import {
  UserPlus,
  Settings,
  PlusCircle,
  FolderPlus,
  Bell,
  Shield,
  LogOut,
  PenSquare,
  Copy,
  Check } from
'lucide-react';
import { db } from '../lib/database';
interface ServerDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  currentUser: {
    id: string;
  };
  onServerSettings: () => void;
  onCreateChannel: () => void;
  onCreateCategory: () => void;
  onNotificationSettings: () => void;
  onPrivacySettings: () => void;
  onEditServerProfile: () => void;
  onLeaveServer: () => void;
  isOwner: boolean;
}
export function ServerDropdownMenu({
  isOpen,
  onClose,
  serverId,
  currentUser,
  onServerSettings,
  onCreateChannel,
  onCreateCategory,
  onNotificationSettings,
  onPrivacySettings,
  onEditServerProfile,
  onLeaveServer,
  isOwner
}: ServerDropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  const handleCreateInvite = () => {
    const invite = db.createInvite(serverId, currentUser.id);
    setInviteCode(invite.code);
    setShowInviteModal(true);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (!isOpen && !showInviteModal) return null;
  const MenuItem = ({
    label,
    icon: Icon,
    onClick,
    variant = 'default',
    subLabel






  }: {label: string;icon: React.ElementType;onClick: () => void;variant?: 'default' | 'danger' | 'premium';subLabel?: string;}) =>
  <button
    onClick={(e) => {
      e.stopPropagation();
      onClick();
      onClose();
    }}
    className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-sm font-medium group transition-colors mb-0.5
        ${variant === 'danger' ? 'text-[#f04747] hover:bg-[#f04747] hover:text-white' : variant === 'premium' ? 'text-[#ff73fa] hover:bg-[#ff73fa] hover:text-white' : 'text-[#b9bbbe] hover:bg-[#5865f2] hover:text-white'}
      `}>

      <div className="flex flex-col items-start">
        <span>{label}</span>
        {subLabel && <span className="text-[10px] opacity-70">{subLabel}</span>}
      </div>
      <Icon size={16} />
    </button>;

  return (
    <>
      {isOpen &&
      <div
        ref={menuRef}
        className="absolute top-[56px] left-4 w-[220px] bg-[#18191c] rounded-md shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-left">

          <div className="space-y-0.5">
            <MenuItem
            label="Server Boost"
            icon={FolderPlus}
            onClick={() => {}}
            variant="premium" />

            <div className="h-[1px] bg-[#2f3136] my-1 mx-1" />

            <MenuItem
            label="Invite People"
            icon={UserPlus}
            onClick={handleCreateInvite}
            variant="premium" />

            <MenuItem
            label="Server Settings"
            icon={Settings}
            onClick={onServerSettings} />

            <MenuItem
            label="Create Channel"
            icon={PlusCircle}
            onClick={onCreateChannel} />

            <MenuItem
            label="Create Category"
            icon={FolderPlus}
            onClick={onCreateCategory} />

            <div className="h-[1px] bg-[#2f3136] my-1 mx-1" />

            <MenuItem
            label="Notification Settings"
            icon={Bell}
            onClick={onNotificationSettings} />

            <MenuItem
            label="Privacy Settings"
            icon={Shield}
            onClick={onPrivacySettings} />

            <div className="h-[1px] bg-[#2f3136] my-1 mx-1" />

            <MenuItem
            label="Edit Server Profile"
            icon={PenSquare}
            onClick={onEditServerProfile} />

            <div className="h-[1px] bg-[#2f3136] my-1 mx-1" />

            <MenuItem
            label={isOwner ? 'Delete Server' : 'Leave Server'}
            icon={LogOut}
            onClick={onLeaveServer}
            variant="danger" />

          </div>
        </div>
      }

      {showInviteModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#36393f] rounded-lg w-full max-w-[440px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h2 className="text-lg font-bold text-white mb-2">
                Invite friends to this server
              </h2>
              <p className="text-[#b9bbbe] text-sm mb-6">
                Share this link with others to grant access to this server!
              </p>

              <div className="bg-[#202225] p-2 rounded flex items-center justify-between border border-[#202225] focus-within:border-[#5865f2] transition-colors">
                <input
                readOnly
                value={inviteCode}
                className="bg-transparent text-[#dcddde] w-full outline-none font-mono" />

                <button
                onClick={copyToClipboard}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${copied ? 'bg-[#3ba55c] text-white' : 'bg-[#5865f2] hover:bg-[#4752c4] text-white'}`}>

                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="text-[#b9bbbe] text-xs mt-2">
                Your invite link expires in 7 days.
              </p>
            </div>
            <div className="bg-[#2f3136] p-4 flex justify-end">
              <button
              onClick={() => {
                setShowInviteModal(false);
                onClose();
              }}
              className="text-white text-sm font-medium hover:underline">

                Close
              </button>
            </div>
          </div>
        </div>
      }
    </>);

}