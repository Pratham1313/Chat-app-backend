import mongoose from "mongoose";

const conversationSchema = mongoose.Schema(
  {
    participant: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
        default: [],
      },
    ],
    encryptionToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Conversations = mongoose.model("Conversations", conversationSchema);
export default Conversations;
