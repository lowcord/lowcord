import React, { useState } from 'react';
import { Hash, Volume2, X } from 'lucide-react';
interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (name: string, type: 'text' | 'voice') => void;
}
export function CreateChannelModal({
  isOpen,
  onClose,
  onCreateChannel
}: CreateChannelModalProps) {
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [channelName, setChannelName] = useState('');
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (channelName.trim()) {
      onCreateChannel(channelName.trim(), channelType);
      setChannelName('');
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-[#36393f] w-full max-w-[460px] rounded-md shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Create Channel</h2>
            <button
              onClick={onClose}
              className="text-[#b9bbbe] hover:text-[#dcddde]">

              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-3">
              Channel Type
            </label>
            <div className="space-y-2">
              <label
                className={`flex items-center p-3 rounded cursor-pointer border ${channelType === 'text' ? 'bg-[#40444b] border-transparent' : 'border-transparent hover:bg-[#32353b]'}`}
                onClick={() => setChannelType('text')}>

                <Hash size={24} className="text-[#8e9297] mr-3" />
                <div className="flex-1">
                  <div className="text-white font-medium">Text</div>
                  <div className="text-[#b9bbbe] text-xs">
                    Send messages, images, GIFs, emoji, opinions, and puns
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${channelType === 'text' ? 'border-[#5865f2]' : 'border-[#b9bbbe]'}`}>

                  {channelType === 'text' &&
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5865f2]" />
                  }
                </div>
              </label>

              <label
                className={`flex items-center p-3 rounded cursor-pointer border ${channelType === 'voice' ? 'bg-[#40444b] border-transparent' : 'border-transparent hover:bg-[#32353b]'}`}
                onClick={() => setChannelType('voice')}>

                <Volume2 size={24} className="text-[#8e9297] mr-3" />
                <div className="flex-1">
                  <div className="text-white font-medium">Voice</div>
                  <div className="text-[#b9bbbe] text-xs">
                    Hang out together with voice, video, and screen share
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${channelType === 'voice' ? 'border-[#5865f2]' : 'border-[#b9bbbe]'}`}>

                  {channelType === 'voice' &&
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5865f2]" />
                  }
                </div>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block text-[#b9bbbe] text-xs font-bold uppercase mb-2">
              Channel Name
            </label>
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[#b9bbbe]">
                {channelType === 'text' ?
                <Hash size={16} /> :

                <Volume2 size={16} />
                }
              </div>
              <input
                type="text"
                value={channelName}
                onChange={(e) =>
                setChannelName(
                  e.target.value.toLowerCase().replace(/\s+/g, '-')
                )
                }
                placeholder="new-channel"
                className="w-full bg-[#202225] text-[#dcddde] p-2.5 pl-8 rounded border-none focus:ring-0 font-medium"
                autoFocus />

            </div>
          </form>
        </div>

        <div className="bg-[#2f3136] p-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="text-white text-sm font-medium hover:underline px-4 py-2">

            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!channelName.trim()}
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

            Create Channel
          </button>
        </div>
      </div>
    </div>);

}