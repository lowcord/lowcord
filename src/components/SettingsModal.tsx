import React, { useEffect, useState } from 'react';
import {
  X,
  LogOut,
  User,
  Palette,
  Monitor,
  Mic,
  Bell,
  Keyboard,
  Globe,
  Camera,
  Check,
  Shield,
  Key,
  Smartphone,
  Laptop,
  Eye,
  EyeOff,
  Volume2,
  Activity } from
'lucide-react';
import { UserAvatar } from './UserAvatar';
interface User {
  username: string;
  discriminator: string;
  avatarColor: string;
  aboutMe?: string;
  customStatus?: string;
  email?: string;
  phone?: string;
}
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (updatedUser: Partial<User>) => void;
  onLogout: () => void;
}
const AVATAR_COLORS = [
'#7289da',
'#43b581',
'#faa61a',
'#f04747',
'#f47fff',
'#e67e22',
'#3498db',
'#1abc9c',
'#9b59b6',
'#e91e63'];

export function SettingsModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState('My Account');
  const [pendingUser, setPendingUser] = useState<User>(currentUser);
  const [hasChanges, setHasChanges] = useState(false);
  // My Account Accordion State
  const [activeAccordion, setActiveAccordion] = useState<
    'username' | 'email' | 'phone' | 'password' | null>(
    null);
  const [revealEmail, setRevealEmail] = useState(false);
  const [showToast, setShowToast] = useState(false);
  // Form States
  const [editUsername, setEditUsername] = useState(currentUser.username);
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  // Reset pending user when modal opens or current user changes
  useEffect(() => {
    setPendingUser(currentUser);
    setHasChanges(false);
    setEditUsername(currentUser.username);
    setEditEmail(currentUser.email || '');
    setEditPhone(currentUser.phone || '');
  }, [currentUser, isOpen]);
  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  const handleSave = () => {
    onUpdateUser(pendingUser);
    setHasChanges(false);
  };
  const handleReset = () => {
    setPendingUser(currentUser);
    setHasChanges(false);
  };
  const handleChange = (field: keyof User, value: string) => {
    setPendingUser((prev) => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };
  const showSuccessToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };
  const handleSaveField = (field: keyof User, value: string) => {
    onUpdateUser({
      [field]: value
    });
    setActiveAccordion(null);
    showSuccessToast();
  };
  const handleSavePassword = () => {
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    // In a real app, we'd verify currentPassword here
    setActiveAccordion(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    showSuccessToast();
  };
  const getMaskedEmail = (email?: string) => {
    if (!email) return 'No email set';
    const [user, domain] = email.split('@');
    return `${user[0]}***@${domain}`;
  };
  if (!isOpen) return null;
  const SidebarItem = ({
    label,
    icon: Icon,
    isDestructive = false,
    onClick





  }: {label: string;icon?: React.ElementType;isDestructive?: boolean;onClick?: () => void;}) =>
  <div
    onClick={onClick || (() => setActiveTab(label))}
    className={`
        px-2.5 py-1.5 rounded cursor-pointer mb-0.5 flex items-center justify-between group
        ${activeTab === label && !isDestructive ? 'bg-[#393c43] text-white' : ''}
        ${!isDestructive && activeTab !== label ? 'text-[#b9bbbe] hover:bg-[#32353b] hover:text-[#dcddde]' : ''}
        ${isDestructive ? 'text-[#f04747] hover:bg-[#f047471a]' : ''}
      `}>

      <span className="font-medium text-[15px]">{label}</span>
      {Icon && <Icon size={16} />}
    </div>;

  return (
    <div className="fixed inset-0 z-50 flex bg-[#2f3136] animate-in fade-in duration-200">
      {/* Sidebar */}
      <div className="w-[218px] bg-[#2f3136] flex flex-col pt-[60px] pb-4 px-1.5 overflow-y-auto flex-shrink-0 justify-end md:justify-start ml-auto border-r border-[#202225] md:border-none">
        <div className="px-2.5 pb-1.5">
          <h3 className="text-[#8e9297] text-xs font-bold uppercase mb-2 px-2.5">
            User Settings
          </h3>
          <SidebarItem label="My Account" />
          <SidebarItem label="User Profile" />
          <SidebarItem label="Privacy & Safety" />
          <SidebarItem label="Authorized Apps" />
          <SidebarItem label="Connections" />
        </div>

        <div className="h-[1px] bg-[#3f4147] mx-2.5 my-2" />

        <div className="px-2.5 pb-1.5">
          <h3 className="text-[#8e9297] text-xs font-bold uppercase mb-2 px-2.5">
            App Settings
          </h3>
          <SidebarItem label="Appearance" />
          <SidebarItem label="Accessibility" />
          <SidebarItem label="Voice & Video" />
          <SidebarItem label="Text & Images" />
          <SidebarItem label="Notifications" />
          <SidebarItem label="Keybinds" />
          <SidebarItem label="Language" />
        </div>

        <div className="h-[1px] bg-[#3f4147] mx-2.5 my-2" />

        <div className="px-2.5 pb-1.5">
          <SidebarItem
            label="Log Out"
            icon={LogOut}
            isDestructive
            onClick={onLogout} />

        </div>
      </div>

      {/* Content Area */}
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

          {activeTab === 'My Account' &&
          <div className="animate-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-5">My Account</h2>

              {/* Profile Card */}
              <div className="bg-[#2f3136] rounded-lg overflow-hidden mb-8">
                <div
                className="h-[100px]"
                style={{
                  backgroundColor: currentUser.avatarColor
                }} />

                <div className="px-4 pb-4 relative">
                  <div className="absolute -top-[40px] left-4 p-[6px] bg-[#2f3136] rounded-full">
                    <UserAvatar
                    username={currentUser.username}
                    color={currentUser.avatarColor}
                    size="lg"
                    className="w-[80px] h-[80px] text-3xl" />

                  </div>
                  <div className="flex justify-end pt-4 mb-4">
                    <button
                    onClick={() => setActiveTab('User Profile')}
                    className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">

                      Edit User Profile
                    </button>
                  </div>
                  <div className="mt-2">
                    <div className="text-white font-bold text-xl">
                      {currentUser.username}
                      <span className="text-[#b9bbbe] font-medium">
                        #{currentUser.discriminator}
                      </span>
                    </div>
                  </div>

                  {/* Info Fields Accordion */}
                  <div className="bg-[#36393f] rounded-lg mt-4 p-4 space-y-4">
                    {/* Username Section */}
                    <div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[#b9bbbe] text-xs font-bold uppercase mb-1">
                            Username
                          </div>
                          <div className="text-white text-sm">
                            {currentUser.username}
                            <span className="text-[#b9bbbe]">
                              #{currentUser.discriminator}
                            </span>
                          </div>
                        </div>
                        <button
                        onClick={() =>
                        setActiveAccordion(
                          activeAccordion === 'username' ?
                          null :
                          'username'
                        )
                        }
                        className="bg-[#4f545c] hover:bg-[#5d6269] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">

                          Edit
                        </button>
                      </div>

                      <div
                      className={`grid transition-all duration-300 ease-in-out ${activeAccordion === 'username' ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>

                        <div className="overflow-hidden bg-[#2f3136] rounded p-4">
                          <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                            Username
                          </label>
                          <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="w-full bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#5865f2] transition-colors mb-4" />

                          <div className="flex justify-end gap-3">
                            <button
                            onClick={() => setActiveAccordion(null)}
                            className="text-white hover:underline text-sm font-medium">

                              Cancel
                            </button>
                            <button
                            onClick={() =>
                            handleSaveField('username', editUsername)
                            }
                            className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded text-sm font-medium transition-colors">

                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Email Section */}
                    <div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[#b9bbbe] text-xs font-bold uppercase mb-1">
                            Email
                          </div>
                          <div className="text-white text-sm flex items-center gap-2">
                            {revealEmail ?
                          currentUser.email :
                          getMaskedEmail(currentUser.email)}
                            <button
                            onClick={() => setRevealEmail(!revealEmail)}
                            className="text-[#b9bbbe] hover:text-[#dcddde] ml-1">

                              {revealEmail ?
                            <EyeOff size={14} /> :

                            <Eye size={14} />
                            }
                            </button>
                          </div>
                        </div>
                        <button
                        onClick={() =>
                        setActiveAccordion(
                          activeAccordion === 'email' ? null : 'email'
                        )
                        }
                        className="bg-[#4f545c] hover:bg-[#5d6269] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">

                          Edit
                        </button>
                      </div>

                      <div
                      className={`grid transition-all duration-300 ease-in-out ${activeAccordion === 'email' ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>

                        <div className="overflow-hidden bg-[#2f3136] rounded p-4">
                          <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                            Email
                          </label>
                          <input
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="w-full bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#5865f2] transition-colors mb-4" />

                          <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                            Current Password
                          </label>
                          <input
                          type="password"
                          className="w-full bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#5865f2] transition-colors mb-4" />

                          <div className="flex justify-end gap-3">
                            <button
                            onClick={() => setActiveAccordion(null)}
                            className="text-white hover:underline text-sm font-medium">

                              Cancel
                            </button>
                            <button
                            onClick={() =>
                            handleSaveField('email', editEmail)
                            }
                            className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded text-sm font-medium transition-colors">

                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone Section */}
                    <div>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-[#b9bbbe] text-xs font-bold uppercase mb-1">
                            Phone Number
                          </div>
                          <div className="text-white text-sm">
                            {currentUser.phone ||
                          "You haven't added a phone number yet."}
                          </div>
                        </div>
                        <button
                        onClick={() =>
                        setActiveAccordion(
                          activeAccordion === 'phone' ? null : 'phone'
                        )
                        }
                        className="bg-[#4f545c] hover:bg-[#5d6269] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">

                          {currentUser.phone ? 'Edit' : 'Add'}
                        </button>
                      </div>

                      <div
                      className={`grid transition-all duration-300 ease-in-out ${activeAccordion === 'phone' ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>

                        <div className="overflow-hidden bg-[#2f3136] rounded p-4">
                          <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                            Phone Number
                          </label>
                          <div className="flex gap-2 mb-4">
                            <div className="bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] w-20 flex items-center justify-center">
                              US +1
                            </div>
                            <input
                            type="tel"
                            placeholder="(555) 555-5555"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="flex-1 bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#5865f2] transition-colors" />

                          </div>
                          <div className="flex justify-end gap-3">
                            <button
                            onClick={() => setActiveAccordion(null)}
                            className="text-white hover:underline text-sm font-medium">

                              Cancel
                            </button>
                            <button
                            onClick={() =>
                            handleSaveField('phone', editPhone)
                            }
                            className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded text-sm font-medium transition-colors">

                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-[#3f4147] w-full mb-8" />

              <h3 className="text-white font-bold text-lg mb-4">
                Password and Authentication
              </h3>
              <button
              onClick={() =>
              setActiveAccordion(
                activeAccordion === 'password' ? null : 'password'
              )
              }
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded text-sm font-medium transition-colors mb-4">

                Change Password
              </button>

              <div
              className={`grid transition-all duration-300 ease-in-out ${activeAccordion === 'password' ? 'grid-rows-[1fr] opacity-100 mb-8' : 'grid-rows-[0fr] opacity-0'}`}>

                <div className="overflow-hidden bg-[#2f3136] rounded p-4 max-w-md">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                        Current Password
                      </label>
                      <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#5865f2] transition-colors" />

                    </div>
                    <div>
                      <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                        New Password
                      </label>
                      <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#5865f2] transition-colors" />

                    </div>
                    <div>
                      <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                        Confirm Password
                      </label>
                      <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#5865f2] transition-colors" />

                    </div>

                    {passwordError &&
                  <div className="text-[#f04747] text-xs font-medium mt-1">
                        {passwordError}
                      </div>
                  }

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                      onClick={() => setActiveAccordion(null)}
                      className="text-white hover:underline text-sm font-medium">

                        Cancel
                      </button>
                      <button
                      onClick={handleSavePassword}
                      className="bg-[#43b581] hover:bg-[#3ca374] text-white px-6 py-2 rounded text-sm font-medium transition-colors">

                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                  Two-Factor Authentication
                </h3>
                <p className="text-[#b9bbbe] text-sm mb-4">
                  Protect your Discord account with an extra layer of security.
                  Once configured, you'll be required to enter both your
                  password and an authentication code from your mobile phone in
                  order to sign in.
                </p>
                <button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                  Enable Two-Factor Auth
                </button>
              </div>
            </div>
          }

          {activeTab === 'User Profile' &&
          <div className="animate-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-2">
                User Profile
              </h2>
              <p className="text-[#b9bbbe] text-sm mb-6">
                Customize how your profile looks to other people.
              </p>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* Edit Form */}
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                      Display Name
                    </label>
                    <input
                    type="text"
                    value={pendingUser.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    className="w-full bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#5865f2] transition-colors" />

                  </div>

                  <div>
                    <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                      About Me
                    </label>
                    <textarea
                    value={pendingUser.aboutMe || ''}
                    onChange={(e) => handleChange('aboutMe', e.target.value)}
                    maxLength={190}
                    rows={4}
                    className="w-full bg-[#202225] border border-[#202225] rounded p-2.5 text-[#dcddde] focus:outline-none focus:border-[#5865f2] transition-colors resize-none" />

                    <div className="text-right text-xs text-[#b9bbbe] mt-1">
                      {pendingUser.aboutMe?.length || 0}/190
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                      Avatar Color
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {AVATAR_COLORS.map((color) =>
                    <button
                      key={color}
                      onClick={() => handleChange('avatarColor', color)}
                      className={`w-10 h-10 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center`}
                      style={{
                        backgroundColor: color
                      }}>

                          {pendingUser.avatarColor === color &&
                      <Check
                        size={20}
                        className="text-white drop-shadow-md" />

                      }
                        </button>
                    )}
                    </div>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="w-[300px] flex-shrink-0">
                  <div className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                    Preview
                  </div>
                  <div className="bg-[#18191c] rounded-lg shadow-lg overflow-hidden">
                    <div
                    className="h-[60px] w-full"
                    style={{
                      backgroundColor: pendingUser.avatarColor
                    }} />

                    <div className="px-4 relative">
                      <div className="absolute -top-[40px] p-[6px] bg-[#18191c] rounded-full">
                        <UserAvatar
                        username={pendingUser.username}
                        color={pendingUser.avatarColor}
                        size="lg"
                        className="w-[80px] h-[80px] text-3xl" />

                      </div>
                    </div>
                    <div className="pt-[50px] pb-4 px-4">
                      <div className="mb-4">
                        <span className="text-white font-bold text-xl">
                          {pendingUser.username}
                        </span>
                        <span className="text-[#b9bbbe] text-lg">
                          #{pendingUser.discriminator}
                        </span>
                      </div>
                      <div className="h-[1px] bg-[#2f3136] w-full mb-4" />
                      <div className="mb-4">
                        <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                          About Me
                        </h3>
                        <p className="text-[#dcddde] text-sm whitespace-pre-wrap">
                          {pendingUser.aboutMe ||
                        'Just a Discord user hanging out.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {activeTab === 'Privacy & Safety' &&
          <div className="animate-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-5">
                Privacy & Safety
              </h2>

              <div className="mb-8">
                <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-4">
                  Safe Direct Messaging
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start bg-[#2f3136] p-4 rounded cursor-pointer border border-[#5865f2]">
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">
                        Keep me safe
                      </div>
                      <div className="text-[#b9bbbe] text-sm">
                        Scan direct messages from everyone.
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-[#5865f2] flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-start bg-[#2f3136] p-4 rounded cursor-pointer opacity-70">
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">
                        My friends are nice
                      </div>
                      <div className="text-[#b9bbbe] text-sm">
                        Scan direct messages from everyone unless they are a
                        friend.
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-[#b9bbbe]" />
                  </div>
                  <div className="flex items-start bg-[#2f3136] p-4 rounded cursor-pointer opacity-70">
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">
                        Do not scan
                      </div>
                      <div className="text-[#b9bbbe] text-sm">
                        Direct messages will not be scanned for explicit
                        content.
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border border-[#b9bbbe]" />
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-[#3f4147] w-full mb-8" />

              <div className="mb-8">
                <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-4">
                  Server Privacy Defaults
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-white font-medium">
                      Allow direct messages from server members
                    </div>
                    <div className="text-[#b9bbbe] text-sm">
                      This setting is applied when you join a new server.
                    </div>
                  </div>
                  <div className="w-10 h-6 bg-[#3ba55c] rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          }

          {activeTab === 'Appearance' &&
          <div className="animate-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-5">Appearance</h2>

              <div className="mb-8">
                <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                  Theme
                </h3>
                <div className="flex space-x-4">
                  <div className="flex-1 bg-[#2f3136] p-4 rounded cursor-pointer border-2 border-[#5865f2] relative">
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#5865f2] rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                    <div className="h-12 bg-[#36393f] rounded mb-2" />
                    <div className="h-4 bg-[#202225] rounded w-3/4" />
                    <div className="mt-4 text-center text-white font-bold">
                      Dark
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded cursor-not-allowed opacity-50 border-2 border-transparent">
                    <div className="h-12 bg-[#f2f3f5] rounded mb-2" />
                    <div className="h-4 bg-[#e3e5e8] rounded w-3/4" />
                    <div className="mt-4 text-center text-black font-bold">
                      Light
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                  Message Display
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-[#2f3136] rounded border border-[#5865f2]">
                    <div className="w-4 h-4 rounded-full border-4 border-[#5865f2] mr-3" />
                    <div>
                      <div className="text-white font-bold">Cozy</div>
                      <div className="text-[#b9bbbe] text-sm">
                        Modern, beautiful, and easy on your eyes.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-[#2f3136] rounded opacity-50 cursor-not-allowed">
                    <div className="w-4 h-4 rounded-full border border-[#b9bbbe] mr-3" />
                    <div>
                      <div className="text-white font-bold">Compact</div>
                      <div className="text-[#b9bbbe] text-sm">
                        Fit more messages on screen at once. #IRC
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {activeTab === 'Voice & Video' &&
          <div className="animate-in slide-in-from-bottom-4 duration-300">
              <h2 className="text-xl font-bold text-white mb-5">
                Voice & Video
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                    Input Device
                  </h3>
                  <div className="bg-[#202225] p-2.5 rounded text-white text-sm border border-[#202225] flex justify-between items-center">
                    Default
                    <ChevronDown size={16} />
                  </div>
                </div>
                <div>
                  <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                    Output Device
                  </h3>
                  <div className="bg-[#202225] p-2.5 rounded text-white text-sm border border-[#202225] flex justify-between items-center">
                    Default
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                  Input Volume
                </h3>
                <input
                type="range"
                className="w-full accent-[#5865f2]"
                defaultValue={100} />

              </div>

              <div className="mb-6">
                <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                  Output Volume
                </h3>
                <input
                type="range"
                className="w-full accent-[#5865f2]"
                defaultValue={100} />

              </div>

              <div className="mb-6">
                <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                  Mic Test
                </h3>
                <div className="bg-[#202225] p-4 rounded flex items-center gap-4">
                  <button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded text-sm font-medium transition-colors">
                    Let's Check
                  </button>
                  <div className="flex-1 h-2 bg-[#2f3136] rounded-full overflow-hidden">
                    <div className="h-full w-[10%] bg-[#3ba55c]" />
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-[#3f4147] w-full mb-6" />

              <div className="mb-6">
                <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-2">
                  Video Settings
                </h3>
                <div className="bg-[#202225] h-[200px] rounded flex items-center justify-center text-[#72767d]">
                  <div className="text-center">
                    <Camera size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No camera detected</p>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* Placeholder for other tabs */}
          {[
          'Authorized Apps',
          'Connections',
          'Accessibility',
          'Text & Images',
          'Notifications',
          'Keybinds',
          'Language'].
          includes(activeTab) &&
          <div className="animate-in slide-in-from-bottom-4 duration-300 flex flex-col items-center justify-center h-[400px]">
              <div className="w-40 h-40 bg-[#2f3136] rounded-full flex items-center justify-center mb-6">
                <Settings size={64} className="text-[#dcddde] opacity-20" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Work in Progress
              </h2>
              <p className="text-[#b9bbbe] text-center max-w-md">
                This settings page is currently under construction by Wumpus.
                Check back later!
              </p>
            </div>
          }
        </div>

        {/* Save Changes Bar (For User Profile Tab) */}
        {hasChanges && activeTab === 'User Profile' &&
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[700px] bg-[#18191c] rounded-lg p-3 flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-2">
            <div className="text-white font-medium px-2">
              Careful — you have unsaved changes!
            </div>
            <div className="flex items-center space-x-4">
              <button
              onClick={handleReset}
              className="text-white hover:underline text-sm font-medium">

                Reset
              </button>
              <button
              onClick={handleSave}
              className="bg-[#43b581] hover:bg-[#3ca374] text-white px-6 py-2 rounded text-sm font-medium transition-colors">

                Save Changes
              </button>
            </div>
          </div>
        }

        {/* Success Toast */}
        {showToast &&
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-[#43b581] text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="bg-white/20 p-1 rounded-full">
              <Check size={16} strokeWidth={3} />
            </div>
            <span className="font-medium">
              Success! Your changes have been saved.
            </span>
          </div>
        }
      </div>
    </div>);

}
function ChevronDown({ size }: {size: number;}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">

      <polyline points="6 9 12 15 18 9" />
    </svg>);

}
function Settings({ size, className }: {size: number;className?: string;}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>

      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>);

}