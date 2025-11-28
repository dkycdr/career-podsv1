import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { searchUsersMeili } from '@/lib/search';

// Simple in-memory rate limiter (per-IP) for dev / small deployments.
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60; // max requests per window
const ipBuckets: Map<string, { count: number; windowStart: number }> = new Map();

function ipFromRequest(req: NextRequest) {
  // Try common headers first
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const cf = req.headers.get('cf-connecting-ip');
  if (cf) return cf;
  return req.headers.get('x-real-ip') ?? 'unknown';
}

export async function GET(request: NextRequest) {
  try {
    const ip = ipFromRequest(request);
    const now = Date.now();
    const bucket = ipBuckets.get(ip) ?? { count: 0, windowStart: now };
    if (now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
      bucket.count = 0;
      bucket.windowStart = now;
    }
    bucket.count += 1;
    ipBuckets.set(ip, bucket);
    if (bucket.count > RATE_LIMIT_MAX) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';
    const role = searchParams.get('role') ?? undefined; // STUDENT | MENTOR | ADMIN etc.
    const limitParam = parseInt(searchParams.get('limit') ?? '10', 10);
    const cursor = searchParams.get('cursor') ?? undefined; // cursor is last seen id
    const viewerId = searchParams.get('viewerId') ?? undefined;

    const limit = Number.isNaN(limitParam) ? 10 : Math.min(Math.max(limitParam, 1), 50);

    if (q.length > 200) {
      return NextResponse.json({ success: false, error: 'Query too long' }, { status: 400 });
    }

      // If Meilisearch is configured, prefer it for fuzzy/fast search.
      if (process.env.MEILISEARCH_URL) {
        try {
          const offset = cursor ? parseInt(cursor, 10) || 0 : 0;
          const meiliRes: any = await searchUsersMeili(q, role, limit, offset);
          const hits = meiliRes.hits || [];
          const usersFromMeili = hits.map((h: any) => ({ id: h.id, name: h.name, avatar: h.avatar || null, major: h.major || null, year: h.year || null, role: h.role || null, email: h.email ?? null }));

          // privacy enforcement: only reveal email to permitted viewers
          let usersWithPrivacy = usersFromMeili.map((u: any) => ({ ...u, email: null }));
          if (viewerId) {
            try {
              const viewerMemberships = await db.podMembership.findMany({ where: { userId: viewerId }, select: { podId: true } });
              const podIds = viewerMemberships.map((m: any) => m.podId);
              let connectedUserIds = new Set<string>();
              if (podIds.length > 0) {
                const members = await db.podMembership.findMany({ where: { podId: { in: podIds } }, select: { userId: true } });
                members.forEach((m: any) => { if (m.userId !== viewerId) connectedUserIds.add(m.userId); });
              }
              usersWithPrivacy = usersFromMeili.map((u: any) => ({ ...u, email: (u.id === viewerId || connectedUserIds.has(u.id)) ? u.email : null }));
            } catch (err) {
              console.error('Error computing viewer permissions for Meili search:', err);
              usersWithPrivacy = usersFromMeili.map((u: any) => ({ ...u, email: null }));
            }
          }

          const nextCursor = (hits.length === limit) ? String(offset + limit) : null;
          return NextResponse.json({ success: true, users: usersWithPrivacy, nextCursor });
        } catch (err) {
          console.error('Meilisearch error, falling back to DB search:', err);
          // fall through to DB-based search below
        }
      }

    const where: any = {};

    if (q) {
      // Use simple contains filters. Avoid `mode: 'insensitive'` for compatibility.
      where.OR = [
        { name: { contains: q } },
        { major: { contains: q } },
        { studentId: { contains: q } }
      ];
    }

    if (role) {
      where.role = role;
    }

    // Use simple cursor-based pagination by id
    const findOptions: any = {
      where,
      select: {
        id: true,
        name: true,
        avatar: true,
        major: true,
        year: true,
        role: true
      },
      // Order by id to keep cursor-based pagination stable
      orderBy: { id: 'asc' },
      take: limit + 1
    };

    if (cursor) {
      findOptions.cursor = { id: cursor };
      findOptions.skip = 1; // skip the cursor item itself
    }

    const rows = await db.user.findMany(findOptions);

    let nextCursor: string | null = null;
    let users = rows;
    if (rows.length > limit) {
      const last = rows[rows.length - 1];
      nextCursor = last.id;
      users = rows.slice(0, rows.length - 1);
    }

    // Privacy: only include email for the viewer themself or users connected via shared pods
    if (viewerId) {
      try {
        // find pod ids that the viewer is a member of
        const viewerMemberships = await db.podMembership.findMany({ where: { userId: viewerId }, select: { podId: true } });
        const podIds = viewerMemberships.map((m: any) => m.podId);

        let connectedUserIds = new Set<string>();
        if (podIds.length > 0) {
          const members = await db.podMembership.findMany({ where: { podId: { in: podIds } }, select: { userId: true } });
          members.forEach((m: any) => { if (m.userId !== viewerId) connectedUserIds.add(m.userId); });
        }

        // determine which users in the result should have email exposed
        const permittedIds = users.filter((u: any) => u.id === viewerId || connectedUserIds.has(u.id)).map((u: any) => u.id);
        if (permittedIds.length > 0) {
          const emails = await db.user.findMany({ where: { id: { in: permittedIds } }, select: { id: true, email: true } });
          const emailMap: Record<string, string> = {};
          emails.forEach((e: any) => (emailMap[e.id] = e.email));
          users = users.map((u: any) => ({ ...u, email: emailMap[u.id] ?? null }));
        } else {
          users = users.map((u: any) => ({ ...u, email: null }));
        }
      } catch (err) {
        console.error('Error computing viewer permissions for search:', err);
        users = users.map((u: any) => ({ ...u, email: null }));
      }
    } else {
      // no viewer provided — never expose emails
      users = users.map((u: any) => ({ ...u, email: null }));
    }

    return NextResponse.json({ success: true, users, nextCursor });
  } catch (error: any) {
    console.error('User search error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
