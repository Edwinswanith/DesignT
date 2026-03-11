import mongoose, { Schema, Document } from "mongoose";

export interface IUserActivity extends Document {
  userEmail: string;
  userName: string;
  action: "login" | "design_generated" | "order_placed";
  metadata: Record<string, any>;
  createdAt: Date;
}

const userActivitySchema = new Schema<IUserActivity>(
  {
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    action: {
      type: String,
      enum: ["login", "design_generated", "order_placed"],
      required: true,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const UserActivity = mongoose.models.UserActivity || mongoose.model<IUserActivity>("UserActivity", userActivitySchema);
