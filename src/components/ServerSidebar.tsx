import React, { useState } from 'react';
import { Plus, Compass } from 'lucide-react';
import { Server } from '../App';
interface ServerSidebarProps {
  servers: Server[];
  selectedServer: Server | null;
  onSelectServer: (server: Server) => void;
  onSelectHome: () => void;
  isHomeSelected: boolean;
  onCreateServer: () => void;
  onJoinServer: (code: string) => boolean;
}
export function ServerSidebar({
  servers,
  selectedServer,
  onSelectServer,
  onSelectHome,
  isHomeSelected,
  onCreateServer,
  onJoinServer
}: ServerSidebarProps) {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onJoinServer(inviteCode)) {
      setShowJoinModal(false);
      setInviteCode('');
      setJoinError('');
    } else {
      setJoinError('Invalid or expired invite code.');
    }
  };
  return (
    <>
      <div className="w-[72px] bg-[#202225] flex flex-col items-center py-3 gap-2 overflow-y-auto">
        {/* Home Button */}
        <button
          onClick={onSelectHome}
          className={`w-12 h-12 rounded-[24px] flex items-center justify-center transition-all duration-200 ${isHomeSelected ? 'bg-[#5865f2] rounded-[16px]' : 'bg-[#36393f] hover:bg-[#5865f2] hover:rounded-[16px]'}`}>

          <svg
            className="w-7 h-7 text-white"
            viewBox="0 0 24 24"
            fill="currentColor">

            <path d="M19.73 9.27l-7-7a1 1 0 00-1.46 0l-7 7A1 1 0 005 11h1v8a1 1 0 001 1h4a1 1 0 001-1v-4h2v4a1 1 0 001 1h4a1 1 0 001-1v-8h1a1 1 0 00.73-1.73z" />
          </svg>
        </button>

        <div className="w-8 h-0.5 bg-[#36393f] rounded-full my-1" />

        {/* Server List */}
        {servers.map((server) =>
        <div key={server.id} className="relative group">
            <div
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-white transition-all ${selectedServer?.id === server.id ? 'h-10' : 'h-0 group-hover:h-5'}`} />

            <button
            onClick={() => onSelectServer(server)}
            className={`w-12 h-12 rounded-[24px] flex items-center justify-center transition-all duration-200 overflow-hidden ${selectedServer?.id === server.id ? 'rounded-[16px]' : 'hover:rounded-[16px]'}`}
            title={server.name}>

              {server.icon ?
            <img
              src={server.icon}
              alt={server.name}
              className="w-full h-full object-cover" /> :


            <div
              className={`w-full h-full flex items-center justify-center text-white font-medium ${selectedServer?.id === server.id ? 'bg-[#5865f2]' : 'bg-[#36393f]'}`}>

                  {server.name.
              split(' ').
              map((w) => w[0]).
              join('').
              slice(0, 2)}
                </div>
            }
            </button>
          </div>
        )}

        {/* Add Server Button */}
        <button
          onClick={onCreateServer}
          className="w-12 h-12 rounded-[24px] bg-[#36393f] flex items-center justify-center text-[#3ba55c] hover:bg-[#3ba55c] hover:text-white hover:rounded-[16px] transition-all duration-200"
          title="Add a Server">

          <Plus className="w-6 h-6" />
        </button>

        {/* Join Server Button */}
        <button
          onClick={() => setShowJoinModal(true)}
          className="w-12 h-12 rounded-[24px] bg-[#36393f] flex items-center justify-center text-[#b9bbbe] hover:bg-[#3ba55c] hover:text-white hover:rounded-[16px] transition-all duration-200"
          title="Join a Server">

          <Compass className="w-6 h-6" />
        </button>
      </div>

      {/* Join Server Modal */}
      {showJoinModal &&
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#36393f] rounded-lg w-full max-w-[440px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Join a Server
              </h2>
              <p className="text-[#b9bbbe] text-sm mb-6">
                Enter an invite below to join an existing server.
              </p>

              <form onSubmit={handleJoin}>
                <div className="text-left mb-6">
                  <label className="block text-xs font-bold text-[#b9bbbe] uppercase mb-2">
                    Invite Link
                  </label>
                  <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="hTKzmak"
                  className="w-full bg-[#202225] p-2.5 rounded border-none focus:ring-0 text-[#dcddde] placeholder-[#72767d]"
                  autoFocus />

                  {joinError &&
                <p className="text-[#f04747] text-xs mt-2">{joinError}</p>
                }
                </div>
              </form>
            </div>

            <div className="bg-[#2f3136] p-4 flex justify-between items-center">
              <button
              onClick={() => setShowJoinModal(false)}
              className="text-white text-sm font-medium hover:underline px-4 py-2">

                Back
              </button>
              <button
              onClick={handleJoin}
              disabled={!inviteCode.trim()}
              className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-6 py-2.5 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

                Join Server
              </button>
            </div>
          </div>
        </div>
      }
    </>);

}