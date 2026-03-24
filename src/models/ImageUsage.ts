import mongoose from "mongoose";

const imageUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    totalImagesGenerated: {
      type: Number,
      default: 0,
    },
    todayImagesGenerated: {
      type: Number,
      default: 0,
    },
    dailyLimit: {
      type: Number,
      default: 10,
    },
    remainingImagesToday: {
      type: Number,
      default: 10,
    },
    lastResetDate: {
      type: Date,
      required: true,
      default: () => new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z"),
    },
  },
  { timestamps: true }
);

imageUsageSchema.index({ userId: 1 }, { unique: true });

export const ImageUsage =
  mongoose.models.ImageUsage || mongoose.model("ImageUsage", imageUsageSchema);

/** Get UTC date string (YYYY-MM-DD) for comparison */
function getTodayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Get or create ImageUsage for user and apply daily reset if needed. Returns the doc. */
export async function getOrCreateImageUsage(userId: string) {
  const todayStr = getTodayUTC();

  let doc = await ImageUsage.findOne({ userId });

  if (!doc) {
    const created = await ImageUsage.create({
      userId,
      totalImagesGenerated: 0,
      todayImagesGenerated: 0,
      dailyLimit: 10,
      remainingImagesToday: 10,
      lastResetDate: new Date(todayStr + "T00:00:00.000Z"),
    });
    return created;
  }

  const lastResetStr = doc.lastResetDate.toISOString().slice(0, 10);
  if (todayStr > lastResetStr) {
    doc.todayImagesGenerated = 0;
    doc.remainingImagesToday = doc.dailyLimit;
    doc.lastResetDate = new Date(todayStr + "T00:00:00.000Z");
    await doc.save();
  }

  return doc;
}

/** Atomically decrement remaining and increment totals. Only applies if remainingImagesToday >= 1. Returns updated doc or null if limit already 0. */
export async function recordImageGenerated(userId: string) {
  const doc = await ImageUsage.findOneAndUpdate(
    { userId, remainingImagesToday: { $gte: 1 } },
    {
      $inc: {
        totalImagesGenerated: 1,
        todayImagesGenerated: 1,
        remainingImagesToday: -1,
      },
    },
    { new: true }
  );
  return doc;
}
