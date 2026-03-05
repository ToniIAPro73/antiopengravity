import { db } from './db.js';

export interface ChatMessage {
  id?: number;
  user_id: number;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: string | null;
  created_at?: string;
  tool_call_id?: string | null;
}

const insertMessageStmt = db.prepare(`
  INSERT INTO messages (user_id, role, content, tool_calls)
  VALUES (@user_id, @role, @content, @tool_calls)
`);

const getMessagesStmt = db.prepare(`
  SELECT id, user_id, role, content, tool_calls, created_at
  FROM messages
  WHERE user_id = ?
  ORDER BY id ASC
`);

const clearHistoryStmt = db.prepare(`
  DELETE FROM messages WHERE user_id = ?
`);

export const repository = {
  saveMessage: (msg: Omit<ChatMessage, 'id' | 'created_at'>) => {
    return insertMessageStmt.run({
      user_id: msg.user_id,
      role: msg.role,
      content: msg.content ?? null,
      tool_calls: msg.tool_calls ?? null
    });
  },

  getMessages: (userId: number): ChatMessage[] => {
    return getMessagesStmt.all(userId) as ChatMessage[];
  },

  clearHistory: (userId: number) => {
    return clearHistoryStmt.run(userId);
  }
};
