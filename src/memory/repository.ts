import { db } from './firestore.js';

export interface ChatMessage {
  id?: string;
  user_id: number;
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: string | null;
  created_at?: string;
  tool_call_id?: string | null;
}

export const repository = {
  saveMessage: async (msg: Omit<ChatMessage, 'id' | 'created_at'>) => {
    const userMessagesRef = db.collection('users').doc(msg.user_id.toString()).collection('messages');
    const docRef = userMessagesRef.doc();
    
    await docRef.set({
      user_id: msg.user_id,
      role: msg.role,
      content: msg.content ?? null,
      tool_calls: msg.tool_calls ?? null,
      created_at: new Date().toISOString()
    });
    
    return docRef.id;
  },

  getMessages: async (userId: number): Promise<ChatMessage[]> => {
    const messagesSnapshot = await db.collection('users')
      .doc(userId.toString())
      .collection('messages')
      .orderBy('created_at', 'asc')
      .get();
      
    if (messagesSnapshot.empty) {
      return [];
    }
    
    return messagesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<ChatMessage, 'id'>)
    }));
  },

  clearHistory: async (userId: number) => {
    const messagesRef = db.collection('users').doc(userId.toString()).collection('messages');
    const snapshot = await messagesRef.get();
    
    if (snapshot.empty) return;
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }
};
