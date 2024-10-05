import Conversation from "../model/conversation.js";
import Message from "../model/message.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import crypto from "crypto";

function generateConversationToken(participant1, participant2) {
  const sortedParticipants = [participant1, participant2].sort().join("");
  return crypto.createHash("sha256").update(sortedParticipants).digest("hex");
}

function encrypt(text, token) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(token.slice(0, 32)),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text, token) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(token.slice(0, 32)),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

export async function sendMessage(req, res) {
  try {
    const { recieverId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participant: { $all: [senderId, recieverId] },
    });

    if (!conversation) {
      const token = generateConversationToken(senderId, recieverId);
      conversation = await Conversation.create({
        participant: [senderId, recieverId],
        encryptionToken: token,
      });
    }

    const encryptedMessage = encrypt(message, conversation.encryptionToken);

    const newMessage = new Message({
      senderId,
      recieverId,
      message: encryptedMessage,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    await conversation.save();
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(recieverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        ...newMessage.toObject(),
        message: message, // Send decrypted message to the receiver
      });
    }

    res.status(201).json({
      ...newMessage.toObject(),
      message: message, // Send decrypted message in the response
    });
  } catch (error) {
    console.log("sendMessage route - error - >", error);
    res.status(500).json({ error: "internal server error" });
  }
}

export const getMessage = async (req, res) => {
  try {
    const { recieverId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participant: { $all: [senderId, recieverId] },
    })
      .populate("messages")
      .sort({ createdAt: -1 });

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages.map((msg) => ({
      ...msg.toObject(),
      message: decrypt(msg.message, conversation.encryptionToken),
    }));

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
