import React from 'react';
import { UserAvatar } from './UserAvatar';
import type { Member } from '../App';
interface MemberListProps {
  members: Member[];
  currentUser: Member;
  onMemberClick: (member: Member, event: React.MouseEvent) => void;
}
export function MemberList({
  members,
  currentUser,
  onMemberClick
}: MemberListProps) {
  // Group members by status or role
  const onlineMembers = members.filter((m) => m.status !== 'offline');
  const offlineMembers = members.filter((m) => m.status === 'offline');
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col overflow-y-auto p-3">
      {onlineMembers.length > 0 &&
      <div className="mb-6">
          <h3 className="text-xs font-semibold text-[#8e9297] uppercase mb-2 px-2">
            Online — {onlineMembers.length}
          </h3>
          {onlineMembers.map((member) =>
        <div
          key={member.id}
          onClick={(e) => onMemberClick(member, e)}
          className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#36393f] cursor-pointer group opacity-100">

              <UserAvatar user={member} size="sm" showStatus />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-[#dcddde] group-hover:text-white truncate">
                    {member.displayName}
                  </span>
                </div>
                {member.status !== 'online' &&
            <p className="text-xs text-[#b9bbbe] truncate">
                    {member.status === 'dnd' ? 'Do Not Disturb' : 'Idle'}
                  </p>
            }
              </div>
            </div>
        )}
        </div>
      }

      {offlineMembers.length > 0 &&
      <div>
          <h3 className="text-xs font-semibold text-[#8e9297] uppercase mb-2 px-2">
            Offline — {offlineMembers.length}
          </h3>
          {offlineMembers.map((member) =>
        <div
          key={member.id}
          onClick={(e) => onMemberClick(member, e)}
          className="flex items-center gap-3 px-2 py-1.5 rounded hover:bg-[#36393f] cursor-pointer group opacity-50 hover:opacity-100">

              <UserAvatar user={member} size="sm" showStatus />
              <div className="flex-1 min-w-0">
                <span className="font-medium text-[#dcddde] group-hover:text-white truncate">
                  {member.displayName}
                </span>
              </div>
            </div>
        )}
        </div>
      }
    </div>);

}