import React, { useState } from 'react';
import { db, StoredUser } from '../lib/database';
interface AddFriendTabProps {
  currentUser: StoredUser;
}
export function AddFriendTab({ currentUser }: AddFriendTabProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const handleSendRequest = () => {
    // Expected format: username#0000
    const parts = usernameInput.split('#');
    if (parts.length !== 2) {
      setStatus('error');
      setMessage(
        "Hm, didn't work. Double check that the capitalization, spelling, any spaces, and numbers are correct."
      );
      return;
    }
    const [username, discriminator] = parts;
    if (
    username === currentUser.username &&
    discriminator === currentUser.discriminator)
    {
      setStatus('error');
      setMessage("You can't add yourself as a friend!");
      return;
    }
    const targetUser = db.findUserByTag(username, discriminator);
    if (!targetUser) {
      setStatus('error');
      setMessage(
        "Hm, didn't work. Double check that the capitalization, spelling, any spaces, and numbers are correct."
      );
      return;
    }
    const result = db.sendFriendRequest(currentUser.id, targetUser.id);
    if (result === 'sent') {
      setStatus('success');
      setMessage(
        `Success! Your friend request to ${targetUser.username} was sent.`
      );
      setUsernameInput('');
    } else if (result === 'exists') {
      setStatus('error');
      setMessage("You've already sent a friend request to this user.");
    } else if (result === 'accepted') {
      setStatus('success');
      setMessage(`You are now friends with ${targetUser.username}!`);
      setUsernameInput('');
    }
  };
  return (
    <div className="p-8 w-full max-w-3xl">
      <h2 className="text-white font-bold text-base mb-2 uppercase">
        Add Friend
      </h2>
      <p className="text-[#b9bbbe] text-sm mb-4">
        You can add a friend with their Discord Tag. It's cAsE sEnSitIvE!
      </p>

      <div
        className={`relative flex items-center rounded-lg border ${status === 'success' ? 'border-[#43b581]' : status === 'error' ? 'border-[#f04747]' : 'border-[#202225]'}`}>

        <div className="flex-1 relative">
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => {
              setUsernameInput(e.target.value);
              setStatus('idle');
              setMessage('');
            }}
            placeholder="Enter a Username#0000"
            className="w-full bg-[#202225] rounded-lg py-3 px-4 text-[#dcddde] placeholder-[#72767d] focus:outline-none transition-colors" />

        </div>
        <button
          onClick={handleSendRequest}
          disabled={!usernameInput}
          className="absolute right-3 bg-[#5865f2] hover:bg-[#4752c4] text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">

          Send Friend Request
        </button>
      </div>

      {message &&
      <p
        className={`text-sm mt-2 ${status === 'success' ? 'text-[#43b581]' : 'text-[#f04747]'}`}>

          {message}
        </p>
      }

      <div className="mt-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-40 h-40 bg-[#36393f] rounded-full flex items-center justify-center mb-6">
            <svg
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4f545c"
              strokeWidth="1">

              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="23" y1="11" x2="17" y2="11"></line>
              <line x1="20" y1="8" x2="20" y2="14"></line>
            </svg>
          </div>
          <p className="text-[#72767d] text-center">
            Wumpus is waiting on friends. You don't have any yet!
          </p>
        </div>
      </div>
    </div>);

}