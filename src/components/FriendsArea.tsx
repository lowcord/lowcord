import React, { useEffect, useState } from 'react';
import {
  Users,
  MessageSquare,
  Inbox,
  HelpCircle,
  Search,
  Check,
  X } from
'lucide-react';
import { FriendRow } from './FriendRow';
import { WumpusEmptyState } from './WumpusEmptyState';
import { AddFriendTab } from './AddFriendTab';
import { db, syncChannel, StoredUser, FriendRequest } from '../lib/database';
type TabType = 'online' | 'all' | 'pending' | 'blocked' | 'add';
interface FriendsAreaProps {
  currentUser: StoredUser;
  onStartDM: (userId: string) => void;
}
export function FriendsArea({ currentUser, onStartDM }: FriendsAreaProps) {
  const [activeTab, setActiveTab] = useState<TabType>('online');
  const [friends, setFriends] = useState<StoredUser[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const refreshData = () => {
    setFriends(db.getFriends(currentUser.id));
    setRequests(db.getFriendRequests(currentUser.id));
  };
  useEffect(() => {
    refreshData();
    const handleSync = (event: MessageEvent) => {
      if (
      event.data.type === 'friends_updated' ||
      event.data.type === 'users_updated')
      {
        refreshData();
      }
    };
    syncChannel.addEventListener('message', handleSync);
    return () => syncChannel.removeEventListener('message', handleSync);
  }, [currentUser]);
  const handleAccept = (requestId: string) => {
    db.acceptFriendRequest(requestId);
    refreshData();
  };
  const handleDecline = (requestId: string) => {
    db.declineFriendRequest(requestId);
    refreshData();
  };
  const TabButton = ({
    id,
    label,
    isGreen = false,
    count





  }: {id: TabType;label: string;isGreen?: boolean;count?: number;}) =>
  <button
    onClick={() => setActiveTab(id)}
    className={`
        px-2 py-0.5 mx-2 rounded text-[15px] font-medium transition-colors flex items-center gap-2
        ${isGreen ? `${activeTab === id ? 'bg-transparent text-[#43b581]' : 'bg-[#43b581] text-white hover:bg-[#3ca374]'}` : `${activeTab === id ? 'bg-[#393c43] text-white' : 'text-[#b9bbbe] hover:bg-[#393c43] hover:text-[#dcddde]'}`}
      `}>

      {label}
      {count !== undefined && count > 0 &&
    <span className="bg-[#f04747] text-white text-xs px-1.5 rounded-full">
          {count}
        </span>
    }
    </button>;

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const incomingRequests = pendingRequests.filter(
    (r) => r.toUserId === currentUser.id
  );
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#36393f] h-full">
      {/* Top Toolbar */}
      <div className="h-12 border-b border-[#26272d] flex items-center px-4 flex-shrink-0 shadow-sm">
        <div className="flex items-center text-[#72767d] mr-4">
          <Users className="mr-2" size={24} />
          <span className="font-bold text-white text-base">Friends</span>
        </div>

        <div className="h-6 w-[1px] bg-[#42454a] mx-2" />

        <div className="flex items-center">
          <TabButton id="online" label="Online" />
          <TabButton id="all" label="All" />
          <TabButton
            id="pending"
            label="Pending"
            count={incomingRequests.length} />

          <TabButton id="blocked" label="Blocked" />
          <button
            onClick={() => setActiveTab('add')}
            className={`
              px-2 py-0.5 mx-2 rounded text-[15px] font-medium transition-colors
              ${activeTab === 'add' ? 'text-[#43b581] bg-transparent' : 'bg-[#43b581] text-white'}
            `}>

            Add Friend
          </button>
        </div>

        <div className="ml-auto flex items-center space-x-4 text-[#b9bbbe]">
          <div className="relative cursor-pointer hover:text-[#dcddde]">
            <MessageSquare size={24} />
            <div className="absolute -bottom-1 -right-1 bg-[#f04747] text-white text-[10px] font-bold px-1 rounded-full border-2 border-[#36393f]">
              1
            </div>
          </div>
          <div className="h-6 w-[1px] bg-[#42454a]" />
          <div className="cursor-pointer hover:text-[#dcddde]">
            <Inbox size={24} />
          </div>
          <div className="cursor-pointer hover:text-[#dcddde]">
            <HelpCircle size={24} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'add' ?
        <AddFriendTab currentUser={currentUser} /> :

        <div className="flex flex-col h-full">
            {/* Search within tab */}
            {(activeTab === 'online' || activeTab === 'all') &&
          <div className="px-8 pt-6 pb-4">
                <div className="relative">
                  <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#202225] text-[#dcddde] rounded px-2 py-1.5 pl-2 focus:outline-none" />

                  <Search
                className="absolute right-2 top-1.5 text-[#72767d]"
                size={18} />

                </div>
              </div>
          }

            {/* Tab Content */}
            <div className="px-5 pb-4 flex-1">
              {activeTab === 'online' && friends.length === 0 &&
            <WumpusEmptyState type="no-online" />
            }
              {activeTab === 'all' && friends.length === 0 &&
            <WumpusEmptyState type="no-friends" />
            }
              {activeTab === 'pending' && pendingRequests.length === 0 &&
            <WumpusEmptyState type="no-pending" />
            }
              {activeTab === 'blocked' &&
            <WumpusEmptyState type="no-blocked" />
            }

              {(activeTab === 'online' || activeTab === 'all') &&
            <div className="mt-4">
                  <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-4">
                    {activeTab === 'online' ? 'Online' : 'All Friends'} —{' '}
                    {friends.length}
                  </h3>
                  {friends.map((friend) =>
              <FriendRow
                key={friend.id}
                username={friend.username}
                discriminator={friend.discriminator}
                status={friend.status}
                avatarColor={friend.avatarColor}
                onMessage={() => onStartDM(friend.id)} />

              )}
                </div>
            }

              {activeTab === 'pending' &&
            <div className="mt-4">
                  <h3 className="text-[#b9bbbe] text-xs font-bold uppercase mb-4">
                    Pending — {pendingRequests.length}
                  </h3>
                  {pendingRequests.map((req) => {
                const isIncoming = req.toUserId === currentUser.id;
                const otherUserId = isIncoming ?
                req.fromUserId :
                req.toUserId;
                const otherUser = db.getUser(otherUserId);
                if (!otherUser) return null;
                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-2.5 hover:bg-[#32353b] rounded border-t border-[#42454a] first:border-t-0">

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs">
                            {otherUser.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-white font-bold">
                              {otherUser.username}
                            </span>
                            <span className="text-[#b9bbbe] text-xs ml-1">
                              #{otherUser.discriminator}
                            </span>
                            <div className="text-[#b9bbbe] text-xs">
                              {isIncoming ?
                          'Incoming Friend Request' :
                          'Outgoing Friend Request'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isIncoming &&
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="w-8 h-8 rounded-full bg-[#2f3136] hover:text-[#43b581] flex items-center justify-center transition-colors">

                              <Check size={18} />
                            </button>
                      }
                          <button
                        onClick={() => handleDecline(req.id)}
                        className="w-8 h-8 rounded-full bg-[#2f3136] hover:text-[#f04747] flex items-center justify-center transition-colors">

                            <X size={18} />
                          </button>
                        </div>
                      </div>);

              })}
                </div>
            }
            </div>
          </div>
        }
      </div>
    </div>);

}