import { db } from "@/db";
import { notifications } from "@/db/schema";

type NotificationInput = {
  userId: number;
  type: string;
  title: string;
  message?: string;
  link?: string;
};

export async function createNotification(input: NotificationInput) {
  const [created] = await db
    .insert(notifications)
    .values({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message ?? null,
      link: input.link ?? null,
    })
    .returning();
  return created;
}

export async function notifyVendor(storeOwnerUserId: number, input: Omit<NotificationInput, "userId">) {
  return createNotification({ userId: storeOwnerUserId, ...input });
}