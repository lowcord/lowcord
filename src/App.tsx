// App.tsx
import React, { useEffect, useState, useRef } from 'react'
import PocketBase from 'pocketbase'
import { ServerSidebar } from './components/ServerSidebar'
import { DMSidebar } from './components/DMSidebar'
import { FriendsArea } from './components/FriendsArea'
import { ChannelSidebar } from './components/ChannelSidebar'
import { ChatArea } from './components/ChatArea'
import { MemberList } from './components/MemberList'
import { LoginScreen } from './components/LoginScreen'
import { UserProfilePopup } from './components/UserProfilePopup'
import { SettingsModal } from './components/SettingsModal'
import { CreateServerModal } from './components/CreateServerModal'
import { CreateChannelModal } from './components/CreateChannelModal'
import { ServerSettingsModal } from './components/ServerSettingsModal'
import { WumpusEmptyState } from './components/WumpusEmptyState'

// ────────────────────────────────────────────────
// إعداد PocketBase
const pb = new PocketBase('http://127.0.0.1:8090') // ← غيّر هذا لاحقًا إلى عنوان السيرفر الحقيقي

// ────────────────────────────────────────────────
// أنواع (تم تعديلها قليلاً لتتوافق مع PocketBase)
export interface Member {
  id: string
  username: string
  discriminator: string
  displayName: string
  avatar?: string
  avatarColor: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  roles: string[]
  joinedAt: Date
  email?: string
}

export interface Message { /* ... نفس التعريف السابق ... */ }

export interface Channel { /* ... نفس التعريف ... */ }

export interface Server {
  id: string
  name: string
  icon?: string
  channels: Channel[]
  members: Member[]
  // إضافة حقول من PocketBase إذا لزم
}

export interface ConnectedVoiceState { /* ... */ }

// ────────────────────────────────────────────────
export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(pb.authStore.isValid)
  const [currentUser, setCurrentUser] = useState<Member | null>(null)

  const [servers, setServers] = useState<Server[]>([])
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null)
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [selectedDMUserId, setSelectedDMUserId] = useState<string | null>(null)
  const [view, setView] = useState<'home' | 'server'>('home')

  // ─── جلب بيانات المستخدم بعد تسجيل الدخول ───────────────────────
  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentUser({
        id: pb.authStore.model.id,
        username: pb.authStore.model.username || 'user',
        discriminator: pb.authStore.model.discriminator || '0000',
        displayName: pb.authStore.model.displayName || pb.authStore.model.username,
        avatarColor: pb.authStore.model.avatarColor || '#7289da',
        status: 'online',
        roles: [],
        joinedAt: new Date(),
      })
      setIsLoggedIn(true)
      loadUserServers()
    }
  }, [])

  // ─── جلب السيرفرات التي ينتمي إليها المستخدم ─────────────────────
  const loadUserServers = async () => {
    if (!pb.authStore.model?.id) return

    try {
      const result = await pb.collection('server_members').getList(1, 200, {
        filter: `user = "${pb.authStore.model.id}"`,
        expand: 'server,server.channels',
        sort: '-created',
      })

      const loadedServers = result.items
        .map((item: any) => item.expand?.server)
        .filter(Boolean)
        .map((s: any) => ({
          id: s.id,
          name: s.name,
          icon: s.icon,
          channels: s.expand?.channels || [],
          members: [], // يمكن توسيعها لاحقًا إذا أردت
        }))

      setServers(loadedServers)

      if (loadedServers.length > 0 && !selectedServerId) {
        setSelectedServerId(loadedServers[0].id)
        setView('server')
      }
    } catch (err) {
      console.error('فشل جلب السيرفرات:', err)
    }
  }

  // ─── إنشاء سيرفر جديد ───────────────────────────────────────────────
  const handleCreateServer = async (name: string) => {
    if (!pb.authStore.model?.id) return

    try {
      // 1. إنشاء السيرفر
      const serverRecord = await pb.collection('servers').create({
        name,
        owner: pb.authStore.model.id,
        // icon: ... إذا أردت دعم رفع صورة
      })

      // 2. إضافة المالك كعضو
      await pb.collection('server_members').create({
        server: serverRecord.id,
        user: pb.authStore.model.id,
      })

      // 3. إنشاء قناة عامة افتراضية
      await pb.collection('channels').create({
        server: serverRecord.id,
        name: 'general',
        type: 'text',
      })

      // 4. إعادة تحميل السيرفرات
      await loadUserServers()

      // 5. اختيار السيرفر الجديد
      setSelectedServerId(serverRecord.id)
      setSelectedChannelId(null) // سيتم اختيار القناة الأولى تلقائيًا لاحقًا
      setView('server')

    } catch (err) {
      console.error('فشل إنشاء السيرفر:', err)
      alert('حدث خطأ أثناء إنشاء السيرفر')
    }
  }

  // ─── الانضمام إلى سيرفر عبر كود دعوة ───────────────────────────────
  const handleJoinServer = async (code: string) => {
    if (!pb.authStore.model?.id) return false

    try {
      // 1. البحث عن كود الدعوة
      const invite = await pb.collection('invites').getFirstListItem(
        `code = "${code}"`
      )

      if (!invite) {
        alert('كود الدعوة غير صالح')
        return false
      }

      // 2. التحقق إن كان المستخدم موجودًا بالفعل
      const alreadyMember = await pb.collection('server_members').getList(1, 1, {
        filter: `user = "${pb.authStore.model.id}" && server = "${invite.server}"`
      })

      if (alreadyMember.items.length > 0) {
        alert('أنت عضو بالفعل في هذا السيرفر')
        return true
      }

      // 3. إضافة العضو
      await pb.collection('server_members').create({
        server: invite.server,
        user: pb.authStore.model.id,
      })

      // 4. زيادة عدد الاستخدامات (اختياري)
      await pb.collection('invites').update(invite.id, {
        uses: (invite.uses || 0) + 1
      })

      // 5. إعادة تحميل السيرفرات
      await loadUserServers()

      // 6. اختيار السيرفر
      setSelectedServerId(invite.server)
      setView('server')

      return true

    } catch (err) {
      console.error('فشل الانضمام:', err)
      alert('كود الدعوة غير صالح أو حدث خطأ')
      return false
    }
  }

  // ─── باقي الكود (مثال مبسط للـ UI) ────────────────────────────────
  if (!isLoggedIn || !currentUser) {
    return <LoginScreen onLogin={async (email, pass) => {
      try {
        await pb.collection('users').authWithPassword(email, pass)
        window.location.reload() // أو أعد تحميل الحالة
      } catch (e) {
        alert('فشل تسجيل الدخول')
      }
    }} />
  }

  const selectedServer = servers.find(s => s.id === selectedServerId)

  return (
    <div className="flex h-screen w-full bg-[#36393f] overflow-hidden">
      {/* Server Sidebar */}
      <ServerSidebar
        servers={servers}
        selectedServer={selectedServer || null}
        onSelectServer={(server) => {
          setSelectedServerId(server.id)
          setView('server')
          // يمكنك هنا جلب القنوات إذا لم تكن محملة
        }}
        onSelectHome={() => {
          setSelectedServerId(null)
          setView('home')
        }}
        isHomeSelected={view === 'home'}
        onCreateServer={() => {/* افتح modal */}}
        onJoinServer={handleJoinServer}
      />

      {/* باقي الـ UI (ChannelSidebar, ChatArea, إلخ) */}
      {/* ... يمكنك الاحتفاظ به كما هو مع تعديلات بسيطة لاحقًا ... */}

      {/* Create Server Modal */}
      <CreateServerModal
        isOpen={/* حالة الـ modal */}
        onClose={/* ... */}
        onCreateServer={handleCreateServer}
      />

      {/* باقي المودالات ... */}
    </div>
  )
}