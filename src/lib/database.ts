import { Member, Server, Message } from '../App';

const USERS_KEY = 'discord_clone_users';
const SERVERS_KEY = 'discord_clone_servers';
const FRIEND_REQUESTS_KEY = 'discord_clone_friend_requests';
const FRIENDSHIPS_KEY = 'discord_clone_friendships';
const INVITES_KEY = 'discord_clone_invites';

// Broadcast Channel for cross-tab sync
export const syncChannel = new BroadcastChannel('discord_clone_sync');

export interface StoredUser extends Member {
  password?: string;
  email: string;
  phone?: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: number;
}

export interface Friendship {
  userId1: string;
  userId2: string;
  timestamp: number;
}

export interface Invite {
  code: string;
  serverId: string;
  createdBy: string;
  createdAt: number;
  uses: number;
}

export const db = {
  // --- User Management ---
  getUsers: (): StoredUser[] => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  },

  getUser: (id: string): StoredUser | undefined => {
    return db.getUsers().find((u) => u.id === id);
  },

  saveUser: (user: StoredUser) => {
    const users = db.getUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);

    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    syncChannel.postMessage({ type: 'users_updated' });
  },

  findUserByEmail: (email: string): StoredUser | undefined => {
    const users = db.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  findUserByTag: (
  username: string,
  discriminator: string)
  : StoredUser | undefined => {
    const users = db.getUsers();
    return users.find(
      (u) =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.discriminator === discriminator
    );
  },

  // --- Server Management ---
  getServers: (): Server[] => {
    try {
      const servers = localStorage.getItem(SERVERS_KEY);
      return servers ? JSON.parse(servers) : [];
    } catch (e) {
      return [];
    }
  },

  saveServer: (server: Server) => {
    const servers = db.getServers();
    const existingIndex = servers.findIndex((s) => s.id === server.id);

    if (existingIndex >= 0) {
      servers[existingIndex] = server;
    } else {
      servers.push(server);
    }

    localStorage.setItem(SERVERS_KEY, JSON.stringify(servers));
    syncChannel.postMessage({ type: 'servers_updated' });
  },

  deleteServer: (serverId: string) => {
    const servers = db.getServers().filter((s) => s.id !== serverId);
    localStorage.setItem(SERVERS_KEY, JSON.stringify(servers));
    syncChannel.postMessage({ type: 'servers_updated' });
  },

  // --- Friend System ---
  getFriendRequests: (userId: string): FriendRequest[] => {
    try {
      const requests = JSON.parse(
        localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]'
      ) as FriendRequest[];
      return requests.filter(
        (r) => r.toUserId === userId || r.fromUserId === userId
      );
    } catch {
      return [];
    }
  },

  sendFriendRequest: (fromUserId: string, toUserId: string) => {
    const requests = JSON.parse(
      localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]'
    ) as FriendRequest[];

    // Check if request already exists
    const existing = requests.find(
      (r) =>
      r.fromUserId === fromUserId && r.toUserId === toUserId ||
      r.fromUserId === toUserId && r.toUserId === fromUserId
    );

    if (existing) {
      if (existing.status === 'pending' && existing.fromUserId === toUserId) {
        // If the other person already sent a request, accept it automatically
        db.acceptFriendRequest(existing.id);
        return 'accepted';
      }
      return 'exists';
    }

    const newRequest: FriendRequest = {
      id: Date.now().toString(),
      fromUserId,
      toUserId,
      status: 'pending',
      timestamp: Date.now()
    };

    requests.push(newRequest);
    localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(requests));
    syncChannel.postMessage({ type: 'friends_updated' });
    return 'sent';
  },

  acceptFriendRequest: (requestId: string) => {
    const requests = JSON.parse(
      localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]'
    ) as FriendRequest[];
    const requestIndex = requests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) return;

    const request = requests[requestIndex];
    request.status = 'accepted';
    requests.splice(requestIndex, 1); // Remove request after accepting
    localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(requests));

    // Create friendship
    const friendships = JSON.parse(
      localStorage.getItem(FRIENDSHIPS_KEY) || '[]'
    ) as Friendship[];
    friendships.push({
      userId1: request.fromUserId,
      userId2: request.toUserId,
      timestamp: Date.now()
    });
    localStorage.setItem(FRIENDSHIPS_KEY, JSON.stringify(friendships));
    syncChannel.postMessage({ type: 'friends_updated' });
  },

  declineFriendRequest: (requestId: string) => {
    const requests = JSON.parse(
      localStorage.getItem(FRIEND_REQUESTS_KEY) || '[]'
    ) as FriendRequest[];
    const newRequests = requests.filter((r) => r.id !== requestId);
    localStorage.setItem(FRIEND_REQUESTS_KEY, JSON.stringify(newRequests));
    syncChannel.postMessage({ type: 'friends_updated' });
  },

  getFriends: (userId: string): StoredUser[] => {
    const friendships = JSON.parse(
      localStorage.getItem(FRIENDSHIPS_KEY) || '[]'
    ) as Friendship[];
    const friendIds = friendships.
    filter((f) => f.userId1 === userId || f.userId2 === userId).
    map((f) => f.userId1 === userId ? f.userId2 : f.userId1);

    const allUsers = db.getUsers();
    return allUsers.filter((u) => friendIds.includes(u.id));
  },

  // --- Invites ---
  createInvite: (serverId: string, createdBy: string): Invite => {
    const invites = JSON.parse(
      localStorage.getItem(INVITES_KEY) || '[]'
    ) as Invite[];
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newInvite: Invite = {
      code,
      serverId,
      createdBy,
      createdAt: Date.now(),
      uses: 0
    };

    invites.push(newInvite);
    localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
    return newInvite;
  },

  getInvite: (code: string): Invite | undefined => {
    const invites = JSON.parse(
      localStorage.getItem(INVITES_KEY) || '[]'
    ) as Invite[];
    return invites.find((i) => i.code === code);
  },

  useInvite: (code: string, userId: string): Server | null => {
    const invites = JSON.parse(
      localStorage.getItem(INVITES_KEY) || '[]'
    ) as Invite[];
    const invite = invites.find((i) => i.code === code);

    if (!invite) return null;

    const servers = db.getServers();
    const serverIndex = servers.findIndex((s) => s.id === invite.serverId);

    if (serverIndex === -1) return null;

    const server = servers[serverIndex];
    const user = db.getUser(userId);

    if (!user) return null;

    // Check if user is already a member
    if (server.members.some((m) => m.id === userId)) return server;

    // Add user to server
    server.members.push(user);
    servers[serverIndex] = server;
    localStorage.setItem(SERVERS_KEY, JSON.stringify(servers));

    // Update invite uses
    invite.uses++;
    localStorage.setItem(INVITES_KEY, JSON.stringify(invites));

    syncChannel.postMessage({ type: 'servers_updated' });
    return server;
  },

  // --- Messages (Channels & DMs) ---
  getMessages: (contextId: string): Message[] => {
    try {
      const key = contextId.includes('_') ?
      `dc_dm_messages_${contextId}` :
      `dc_messages_${contextId}`;
      const msgs = localStorage.getItem(key);
      return msgs ? JSON.parse(msgs) : [];
    } catch {
      return [];
    }
  },

  saveMessage: (contextId: string, message: Message) => {
    const key = contextId.includes('_') ?
    `dc_dm_messages_${contextId}` :
    `dc_messages_${contextId}`;
    const messages = db.getMessages(contextId);
    messages.push(message);
    localStorage.setItem(key, JSON.stringify(messages));
    syncChannel.postMessage({ type: 'messages_updated', contextId });
  },

  getDMChannelId: (userId1: string, userId2: string) => {
    return [userId1, userId2].sort().join('_');
  }
};