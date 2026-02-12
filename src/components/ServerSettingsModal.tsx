import React, { useEffect, useState } from 'react';
import {
  Trash2,
  X,
  Save,
  Shield,
  Users,
  UserPlus,
  Search,
  MoreVertical } from
'lucide-react';
import { Server, Member } from '../App';
import { UserAvatar } from './UserAvatar';
interface ServerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  server: Server;
  onUpdateServer: (serverId: string, updates: Partial<Server>) => void;
  onDeleteServer: (serverId: string) => void;
}
export function ServerSettingsModal({
  isOpen,
  onClose,
  server,
  onUpdateServer,
  onDeleteServer
}: ServerSettingsModalProps) {
  const [name, setName] = useState(server.name);
  const [activeTab, setActiveTab] = useState('Overview');
  // Mock roles for UI demonstration
  const [roles, setRoles] = useState([
  {
    id: '1',
    name: '@everyone',
    color: '#99aab5',
    members: server.members.length
  },
  {
    id: '2',
    name: 'Admin',
    color: '#e91e63',
    members: 1
  },
  {
    id: '3',
    name: 'Moderator',
    color: '#3498db',
    members: 2
  }]
  );
  useEffect(() => {
    setName(server.name);
  }, [server, isOpen]);
  if (!isOpen) return null;
  const handleSave = () => {
    if (name.trim() && name !== server.name) {
      onUpdateServer(server.id, {
        name
      });
    }
  };
  const handleDelete = () => {
    if (
    confirm(
      `Are you sure you want to delete ${server.name}? This cannot be undone.`
    ))
    {
      onDeleteServer(server.id);
      onClose();
    }
  };
  const SidebarItem = ({ label, count }: {label: string;count?: number;}) =>
  <div
    onClick={() => setActiveTab(label)}
    className={`px-2.5 py-1.5 rounded cursor-pointer mb-0.5 font-medium text-[15px] flex justify-between items-center ${activeTab === label ? 'bg-[#393c43] text-white' : 'text-[#b9bbbe] hover:bg-[#32353b] hover:text-[#dcddde]'}`}>

      {label}
      {count !== undefined &&
    <span className="text-xs bg-[#202225] px-1.5 py-0.5 rounded-full text-[#dcddde]">
          {count}
        </span>
    }
    </div>;

  return (
    <div className="fixed inset-0 z-50 flex bg-[#2f3136] animate-in fade-in duration-200">
      {/* Sidebar */}
      <div className="w-[218px] bg-[#2f3136] flex flex-col pt-[60px] pb-4 px-1.5 flex-shrink-0 justify-end md:justify-start ml-auto border-r border-[#202225] md:border-none">
        <div className="px-2.5 pb-1.5">
          <h3 className="text-[#8e9297] text-xs font-bold uppercase mb-2 px-2.5">
            {server.name}
          </h3>
          <SidebarItem label="Overview" />
          <SidebarItem label="Roles" />
          <SidebarItem label="Emoji" />
          <SidebarItem label="Stickers" />
          <SidebarItem label="Soundboard" />
          <SidebarItem label="Widget" />
          <SidebarItem label="Server Template" />

          <div className="h-[1px] bg-[#3f4147] mx-2.5 my-2" />

          <h3 className="text-[#8e9297] text-xs font-bold uppercase mb-2 px-2.5">
            User Management
          </h3>
          <SidebarItem label="Members" count={server.members.length} />
          <SidebarItem label="Invites" />
          <SidebarItem label="Bans" />

          <div className="h-[1px] bg-[#3f4147] mx-2.5 my-2" />

          <div
            onClick={handleDelete}
            className="px-2.5 py-1.5 rounded cursor-pointer mb-0.5 font-medium text-[15px] text-[#f04747] hover:bg-[#f047471a] flex items-center justify-between group">

            Delete Server
            <Trash2 size={16} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#36393f] flex flex-col min-w-0 relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar pt-[60px] px-10 pb-20 max-w-[740px]">
          {/* Close Button */}
          <div
            className="fixed top-[60px] right-[40px] flex flex-col items-center group cursor-pointer z-50"
            onClick={onClose}>

            <div className="w-9 h-9 rounded-full border-2 border-[#b9bbbe] flex items-center justify-center text-[#b9bbbe] group-hover:bg-[#3f4147] transition-colors">
              <X size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[#b9bbbe] text-xs font-bold mt-2 group-hover:text-[#dcddde]">
              ESC
            </span>
          </div>

          {activeTab === 'Overview' &&
          <div className="animate-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-5">
                Server Overview
              </h2>

              <div className="flex gap-8">
                {/* Image Upload Placeholder */}
                <div className="flex-shrink-0">
                  <div className="w-[100px] h-[100px] rounded-full bg-[#5865f2] flex items-center justify-center text-white text-3xl font-bold relative group cursor-pointer">
                    {name.substring(0, 2).toUpperCase()}
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white font-medium">
                      CHANGE ICON
                    </div>
                  </div>
                  <div className="text-xs text-[#b9bbbe] mt-2 text-center">
                    Minimum Size: <br /> 128x128
                  </div>
                </div>

                {/* Form */}
                <div className="flex-1 max-w-md">
                  <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                    Server Name
                  </label>
                  <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#7289da] transition-colors mb-6" />


                  {name !== server.name &&
                <div className="flex items-center justify-end">
                      <button
                    onClick={() => setName(server.name)}
                    className="text-white text-sm mr-4 hover:underline">

                        Reset
                      </button>
                      <button
                    onClick={handleSave}
                    className="bg-[#43b581] hover:bg-[#3ca374] text-white px-6 py-2 rounded text-sm font-medium transition-colors">

                        Save Changes
                      </button>
                    </div>
                }
                </div>
              </div>
            </div>
          }

          {activeTab === 'Roles' &&
          <div className="animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-white">Roles</h2>
                <button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
                  Create Role
                </button>
              </div>

              <p className="text-[#b9bbbe] text-sm mb-6">
                Use roles to group your server members and assign permissions.
              </p>

              <div className="space-y-1">
                {roles.map((role) =>
              <div
                key={role.id}
                className="flex items-center justify-between p-3 bg-[#2f3136] rounded hover:bg-[#393c43] cursor-pointer group">

                    <div className="flex items-center gap-3">
                      <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: role.color
                    }} />

                      <span className="text-white font-medium">
                        {role.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[#b9bbbe] text-sm">
                        {role.members} members
                      </span>
                      <MoreVertical
                    size={16}
                    className="text-[#b9bbbe] opacity-0 group-hover:opacity-100" />

                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {activeTab === 'Members' &&
          <div className="animate-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-2">
                Server Members
              </h2>
              <p className="text-[#b9bbbe] text-sm mb-6">
                {server.members.length} Members
              </p>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-[#202225] rounded px-3 py-1.5 flex items-center">
                  <input
                  type="text"
                  placeholder="Search Members"
                  className="bg-transparent border-none outline-none text-[#dcddde] text-sm w-full placeholder-[#72767d]" />

                  <Search size={16} className="text-[#72767d]" />
                </div>
                <div className="relative">
                  <div className="bg-[#202225] rounded px-3 py-1.5 text-[#dcddde] text-sm cursor-pointer min-w-[150px] flex justify-between items-center">
                    Display Role
                    <MoreVertical size={14} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                {server.members.map((member) =>
              <div
                key={member.id}
                className="flex items-center justify-between p-2 hover:bg-[#2f3136] rounded group">

                    <div className="flex items-center gap-3">
                      <UserAvatar user={member} size="sm" />
                      <div>
                        <div className="text-white font-medium flex items-center gap-2">
                          {member.displayName}
                          {member.id === server.members[0].id &&
                      <Shield
                        size={12}
                        className="text-[#faa61a]"
                        fill="currentColor" />

                      }
                        </div>
                        <div className="text-[#b9bbbe] text-xs">
                          {member.username}#{member.discriminator}
                        </div>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2">
                      <button
                    className="p-1.5 hover:bg-[#202225] rounded text-[#b9bbbe] hover:text-[#dcddde]"
                    title="Kick Member">

                        <UserPlus size={16} className="rotate-45" />
                      </button>
                      <button
                    className="p-1.5 hover:bg-[#202225] rounded text-[#b9bbbe] hover:text-[#dcddde]"
                    title="More Options">

                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}