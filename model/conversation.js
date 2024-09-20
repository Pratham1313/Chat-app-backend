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
        type: String,
        ref: "Messages",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("Conversations", conversationSchema);
export default User;
