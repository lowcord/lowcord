import React from 'react';
import { UserAvatar } from './UserAvatar';
import type { Member } from '../App';
interface UserProfilePopupProps {
  user: Member;
  position: {
    x: number;
    y: number;
  };
  onClose: () => void;
}
export function UserProfilePopup({
  user,
  position,
  onClose
}: UserProfilePopupProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 w-[300px] bg-[#18191c] rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150"
        style={{
          top: Math.min(position.y, window.innerHeight - 400),
          left: position.x
        }}>

        <div className="h-[60px] bg-[#5865f2]" />
        <div className="px-4 pb-4 relative">
          <div className="absolute -top-10 left-4 p-1.5 bg-[#18191c] rounded-full">
            <UserAvatar user={user} size="lg" showStatus />
          </div>

          <div className="mt-12 mb-4">
            <h3 className="text-xl font-bold text-white leading-tight">
              {user.displayName}
            </h3>
            <p className="text-[#b9bbbe] text-sm">
              {user.username}#{user.discriminator}
            </p>
          </div>

          <div className="h-px bg-[#2f3136] my-3" />

          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-bold text-[#b9bbbe] uppercase mb-1">
                Member Since
              </h4>
              <p className="text-[#dcddde] text-sm">
                {new Date(user.joinedAt).toLocaleDateString()}
              </p>
            </div>

            {user.roles.length > 0 &&
            <div>
                <h4 className="text-xs font-bold text-[#b9bbbe] uppercase mb-1">
                  Roles
                </h4>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) =>
                <span
                  key={role}
                  className="text-xs text-[#dcddde] bg-[#2f3136] px-2 py-1 rounded flex items-center gap-1">

                      <div className="w-2 h-2 rounded-full bg-[#99aab5]" />
                      {role}
                    </span>
                )}
                </div>
              </div>
            }

            <div>
              <h4 className="text-xs font-bold text-[#b9bbbe] uppercase mb-1">
                Note
              </h4>
              <textarea
                placeholder="Click to add a note"
                className="w-full bg-transparent text-xs text-[#dcddde] placeholder-[#b9bbbe] resize-none focus:outline-none h-8" />

            </div>
          </div>
        </div>
      </div>
    </>);

}