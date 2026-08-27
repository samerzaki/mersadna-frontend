import crypto from 'node:crypto';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from './db.js';
import { config } from './config.js';

export const ok = <T>(reply: FastifyReply, data: T, meta?: Record<string, unknown>) =>
  reply.send({ status: reply.statusCode || 200, success: true, data, ...(meta ? { meta } : {}) });
export const fail = (reply: FastifyReply, status: number, message: string, code = 'REQUEST_FAILED') =>
  reply.code(status).send({ status, success: false, data: null, meta: { message, code } });
export const token = () => crypto.randomBytes(32).toString('base64url');
export const digest = (value: string) => crypto.createHash('sha256').update(value).digest('hex');

declare module 'fastify' { interface FastifyRequest { userId?: number } }

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const raw = request.cookies[config.SESSION_COOKIE_NAME];
  if (!raw) return fail(reply, 401, 'Authentication required', 'UNAUTHENTICATED');
  const session = await prisma.session.findUnique({ where: { tokenHash: digest(raw) } });
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return fail(reply, 401, 'Authentication required', 'UNAUTHENTICATED');
  }
  request.userId = session.userId;
  if (Date.now() - session.lastSeenAt.getTime() > 60 * 60 * 1000) {
    await prisma.session.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } });
  }
}

export function setSession(reply: FastifyReply, raw: string) {
  reply.setCookie(config.SESSION_COOKIE_NAME, raw, {
    httpOnly: true, secure: config.appUsesHttps, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSession(reply: FastifyReply) {
  reply.clearCookie(config.SESSION_COOKIE_NAME, { path: '/' });
}
