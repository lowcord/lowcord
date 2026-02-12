import React, { useState } from 'react';
import { XIcon, UploadIcon, ChevronRightIcon } from 'lucide-react';
interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateServer: (name: string) => void;
}
export function CreateServerModal({
  isOpen,
  onClose,
  onCreateServer
}: CreateServerModalProps) {
  const [serverName, setServerName] = useState('');
  if (!isOpen) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (serverName.trim()) {
      onCreateServer(serverName.trim());
      setServerName('');
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-[440px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-[#060607] mb-2">
            Customize Your Server
          </h2>
          <p className="text-[#4f5660] text-sm mb-6">
            Give your new server a personality with a name and an icon. You can
            always change it later.
          </p>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#b9bbbe] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="bg-[#5865f2] rounded-full p-2 mb-1">
                <UploadIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-[10px] font-bold text-[#4f5660] uppercase">
                Upload
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="text-left mb-6">
              <label className="block text-xs font-bold text-[#4f5660] uppercase mb-2">
                Server Name
              </label>
              <input
                type="text"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                placeholder="My Awesome Server"
                className="w-full bg-[#e3e5e8] p-2.5 rounded border-none focus:ring-0 text-[#060607] placeholder-[#949ba4]"
                autoFocus />

            </div>

            <div className="text-[10px] text-[#747f8d] text-left mb-8">
              By creating a server, you agree to Discord's{' '}
              <span className="text-[#0067e0] font-bold cursor-pointer">
                Community Guidelines
              </span>
              .
            </div>
          </form>
        </div>

        <div className="bg-[#f2f3f5] p-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-[#060607] text-sm font-medium hover:underline px-4 py-2">

            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!serverName.trim()}
            className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2.5 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

            Create
          </button>
        </div>
      </div>
    </div>);

}