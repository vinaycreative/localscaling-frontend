"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Paperclip,
  CalendarClock,
  PhoneCall,
  ChevronRight,
  Ellipsis,
  PanelRight,
  Keyboard,
  CheckCheck,
  SquareSlash,
} from "lucide-react"
import { toDate } from "date-fns"

/* ----------------------------- your data ----------------------------- */
type Attachment = { type: "file"; name: string; size: string; url: string }
type Message = {
  id: string
  sender_id: string
  timestamp: string
  content: string
  attachments: Attachment[]
  read?: boolean
}
type Participant = { id: string; name: string; avatar_url: string }
type Thread = {
  thread_id: string
  participants: Participant[]
  messages: Message[]
}

const THREAD: Thread = {
  thread_id: "GP-1042",
  participants: [
    {
      id: "user_001",
      name: "Sarah",
      avatar_url: "https://example.com/avatars/sarah.png",
    },
    {
      id: "user_002",
      name: "Frank",
      avatar_url: "https://example.com/avatars/frank.png",
    },
  ],
  messages: [
    {
      id: "msg_001",
      sender_id: "user_001",
      timestamp: "2025-10-09T11:40:00Z",
      content:
        "Hey Frank, I've finished with the requirements doc! I made some notes in the gdoc as well for Phoenix to look over.",
      attachments: [],
    },
    {
      id: "msg_002",
      sender_id: "user_001",
      timestamp: "2025-10-09T11:40:15Z",
      content: "",
      attachments: [
        {
          type: "file",
          name: "Tech requirements.pdf",
          size: "1.2 MB",
          url: "https://example.com/files/tech-requirements.pdf",
        },
      ],
    },
    {
      id: "msg_003",
      sender_id: "user_002",
      timestamp: "2025-10-09T11:41:00Z",
      content: "Awesome! Thanks. I'll look at this today.",
      attachments: [],
      read: true,
    },
    {
      id: "msg_004",
      sender_id: "user_001",
      timestamp: "2025-10-09T11:44:00Z",
      content: "No rush though — we still have to wait for Lana's designs.",
      attachments: [],
    },
    {
      id: "msg_005",
      sender_id: "user_001",
      timestamp: "2025-10-15T14:30:00Z",
      content: "Hey Frank, can you please review the latest design?",
      attachments: [],
      read: true,
    },
    {
      id: "msg_006",
      sender_id: "user_002",
      timestamp: "2025-10-15T14:31:00Z",
      content: "Sure thing, I'll have a look today. They're looking great!",
      attachments: [],
    },
    {
      id: "msg_007",
      sender_id: "user_001",
      timestamp: "2025-10-15T14:32:00Z",
      content: "👍",
      attachments: [],
    },
  ],
}

/* --------------------------- helpers --------------------------- */

const CURRENT_USER_ID = "user_002"
type Dateish = Date | string | number;
type BaseFmt = {
  /** e.g. "en-US" */
  locale?: string;
  /** IANA TZ, e.g. "America/Los_Angeles" */
  timeZone?: string;
};

function formatTime(ts: string) {
  const d = new Date(ts)
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}
function formatDateTime(input: Dateish, opts: BaseFmt = {}): string {
  const d = toDate(input);
  return d.toLocaleString(opts.locale, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: opts.timeZone,
  });
}

function TimeLabel(ts: string) {
  const d = new Date(ts)
  // e.g. "Thu 11:40 AM" or "Today"
  const today = new Date()
  const isSameDay = d.toDateString() === today.toDateString()
  if (isSameDay) return "Today"
  return d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" , year:"numeric" })
}

function needsDateDivider(prev: Message | null, curr: Message) {
  if (!prev) return true
  const pd = new Date(prev.timestamp).toDateString()
  const cd = new Date(curr.timestamp).toDateString()
  return pd !== cd
}

function byId<T extends { id: string }>(arr: T[], id: string) {
  return arr.find((x) => x.id === id)
}

/* ------------------------------ page ------------------------------ */
export default function SupportChatPage() {
  const { supportId } = useParams<{ supportId: string }>()
  const router = useRouter()

  // you could fetch by `supportId`; here we just assert it matches
  const thread = THREAD?.thread_id === supportId ? THREAD : THREAD
  const you = byId(thread?.participants, CURRENT_USER_ID)!
  const other = thread.participants.find((p) => p.id !== CURRENT_USER_ID)!

  const fileRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="mx-auto w-full px-4 py-6 bg-background">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]">
        {/* Left */}
        <div>
          {/* header */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex flex-col items-start">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 px-0"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold tracking-tight">#{thread.thread_id}</h1>
            </div>

            {/* mobile sidebar trigger */}
            <div className="ml-auto md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <PanelRight className="h-4 w-4" />
                    Details
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[320px] p-0">
                  <RightSidebar other={other} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="flex h-[78vh] flex-col">
            {/* messages */}
            <div className="flex-1 px-4 py-3 overflow-y-scroll">
              <div className="mx-auto space-y-5">
                {thread?.messages?.map((m, i) => {
                  const prev = i > 0 ? thread.messages[i - 1] : null
                  const showDivider = needsDateDivider(prev, m)
                  const sender = byId(thread.participants, m.sender_id)!
                  const isYou = m.sender_id === CURRENT_USER_ID
                  return (
                    <React.Fragment key={m.id}>
                      {showDivider && (
                        <div className="my-4 flex items-center gap-3">
                          <Separator className="flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {TimeLabel(m.timestamp)}
                          </span>
                          <Separator className="flex-1" />
                        </div>
                      )}
                      <MessageBubble
                        author={isYou ? you.name : sender.name}
                        avatarUrl={isYou ? you.avatar_url : sender.avatar_url}
                        isYou={isYou}
                        time={`${TimeLabel(m.timestamp)}, ${formatTime(m.timestamp)}`}
                        text={m.content}
                        attachments={m.attachments}
                      />
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
            {/* composer */}
            <div className={cn("rounded-lg border bg-background")}>
              <Textarea
                placeholder="Message"
                rows={3}
                className={cn(
                  "min-h-[64px] max-h-[100px] w-full border-1 border-muted-foreground/20", // remove inner border
                  "focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none", // no focus ring
                  "px-3 py-3"
                )}
              />

              {/* Footer bar */}
              <div className="flex items-center gap-4 rounded-b-lg bg-muted/20 px-3 py-2">
                <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <SquareSlash className="h-4 w-4" />
                  <span className="font-semibold text-gray-600 text-xs">Shortcuts</span>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => fileRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                  <span className="font-semibold text-gray-600 text-xs">Attach</span>
                </button>

                {/* hidden file input */}
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    // if (f && onAttach) onAttach(f)
                    // reset so same file can be re-selected
                    e.currentTarget.value = ""
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Right sidebar */}
        <div>
          {/* right sidebar (desktop only) */}
          <div className="hidden md:block bg-background">
            <RightSidebar other={other} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* --------------------------- components --------------------------- */

export function MessageBubble(props: {
  author: string
  avatarUrl: string
  isYou: boolean
  time: string
  text?: string
  attachments?: Attachment[]
  read?: boolean
}) {
  const { author, avatarUrl, isYou, time, text, attachments, read } = props

  return (
    <div className={cn("flex gap-3", isYou ? "justify-end" : "items-start")}>
      {/* Avatar only for incoming */}
      {!isYou && (
        <Avatar className="h-7 w-7 mt-3">
          <AvatarImage src={avatarUrl} alt={author} />
          <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex min-w-auto max-w-[78%] flex-col", isYou && "items-end ml-auto")}>
        {/* Header line */}
        <div className="mb-1 flex gap-2 w-full items-center text-[11px] leading-none text-muted-foreground">
          <span className="font-medium">{isYou ? "You" : author}</span>
          <span className="ml-auto inline-flex items-center gap-1">
            {time}
            {isYou && read && <CheckCheck className="h-3.5 w-3.5 text-primary/70" />}
          </span>
        </div>

        {/* Bubble */}
        <div className={cn("rounded-lg border px-3 py-2", isYou ? "rounded-tr-none" : "bg-muted/60 rounded-tl-none")}>
          {text && <p className={cn("text-sm leading-5", isYou && "text-foreground/90")}>{text}</p>}

          {!!attachments?.length && (
            <div className="mt-2 space-y-1">
              {attachments.map((a) => (
                <Link
                  key={a.name}
                  href={a.url}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                >
                  <Badge variant="secondary" className="rounded-sm bg-red-500/10 text-red-600">
                    PDF
                  </Badge>
                  <span className="truncate">{a.name}</span>
                  <span className="text-muted-foreground">{a.size}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RightSidebar({ other }: { other: Participant }) {
  return (
    <div className="h-full p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={other.avatar_url} alt={other.name} />
          <AvatarFallback>{other.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold leading-none">{other.name}</h3>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {other.name.toLowerCase()}@localscaling.com
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <Button className="w-full justify-center gap-2">
          <PhoneCall className="h-4 w-4" />
          Schedule Call
        </Button>

        <Card className="p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Next appointment</p>

          <div className="flex items-center gap-3 rounded-md border p-3">
            <div className="flex h-10 w-10 flex-col items-center justify-center rounded-md bg-muted text-[10px] font-semibold">
              <span>JAN</span>
              <span className="text-base leading-none">10</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <span className="truncate text-sm font-medium">12.10.2025, 14.00 Uhr</span>
              </div>
              <p className="truncate text-xs text-muted-foreground">Google Meet Call</p>
            </div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">About</p>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Company</span>
              <span className="font-medium">LocalScaling</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">PM</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
