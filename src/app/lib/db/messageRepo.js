import { sql } from "./postgresql";

export const messageRepo = {
  viewedMessage,
  saveMessage,
  readMessageHistory,
  updateMessage,
  updateNotification,
  getNumber,
  markNotification,
  getUnreadUsers,
};

async function viewedMessage(messageIds,viewerEmail) {
   // 1. Update messages status to 'delivered'
        await sql`
          UPDATE "Message"
          SET status = 'delivered'
          WHERE id = ANY(${messageIds}) 
            AND receiver = ${viewerEmail}
            AND status = 'sent'
        `;

        // 2. Fetch updated messages
        const updatedMessages = await sql`
          SELECT id, sender FROM "Message" WHERE id = ANY(${messageIds})
        `;
        return updatedMessages
}

async function saveMessage(id, message, sender, receiver, status) {
  const [newMessage] = await sql`
    INSERT INTO "Message" ("id", "message", "sender", "receiver", "status")
    VALUES (${id}, ${message}, ${sender}, ${receiver}, ${status})
    RETURNING *
  `;
  return newMessage;
}

async function getUnreadUsers(email) {
  const users = await sql`
    SELECT DISTINCT "sender"
    FROM "Message"
    WHERE "receiver" = ${email} AND "status" = 'sent'
  `;
  return users;
}

async function updateMessage(id, status) {
  try {
    const updatedMessage = await sql`
      UPDATE "Message"
      SET "status" = ${status}
      WHERE "id" = ${id}
      RETURNING *
    `;

    if (updatedMessage.length === 0) {
      console.warn(`Message with id ${id} not found.`);
      return null;
    }

    return updatedMessage[0];
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
}

async function updateNotification(receiverEmail) {
  try {
    // Try to update unreadCount
    const updated = await sql`
      UPDATE "Notification"
      SET "unreadCount" = "unreadCount" + 1
      WHERE "email" = ${receiverEmail}
      RETURNING *
    `;

    if (updated.length > 0) {
      return updated[0];
    }

    // If no row updated, insert new notification with unreadCount = 1
    const inserted = await sql`
      INSERT INTO "Notification" ("email", "unreadCount")
      VALUES (${receiverEmail}, 1)
      RETURNING *
    `;
    return inserted[0];
  } catch (error) {
    console.error("Error updating notification:", error);
    throw error;
  }
}

async function markNotification(email) {
  try {
    const updated = await sql`
      UPDATE "Notification"
      SET "unreadCount" = 0
      WHERE "email" = ${email}
      RETURNING *
    `;
    return updated[0] || null;
  } catch (error) {
    console.log("Error marking notification:", error);
    throw error;
  }
}

async function getNumber(email) {
  try {
    const notification = await sql`
      SELECT * FROM "Notification" WHERE "email" = ${email} LIMIT 1
    `;
    return notification[0]?.unreadCount || null;
  } catch (error) {
    console.log("Error fetching notification:", error);
    throw error;
  }
}

async function readMessageHistory(sender, receiver) {
  try {
    const messages = await sql`
      SELECT "id", "sender", "receiver", "message", "timeStamp", "status"
      FROM "Message"
      WHERE ("sender" = ${sender} AND "receiver" = ${receiver})
         OR ("sender" = ${receiver} AND "receiver" = ${sender})
      ORDER BY "timeStamp" ASC
    `;

    // Map to simplified format
    return messages.map(msg => ({
      id: msg.id,
      from: msg.sender,
      to: msg.receiver,
      message: msg.message,
      timestamp: msg.timeStamp,
      status: msg.status
    }));
  } catch (error) {
    console.log("Error fetching message history:", error);
    throw error;
  }
}
