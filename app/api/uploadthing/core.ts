import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error("Sin autorización");
      return { adminId: session.user?.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(
        "[UploadThing] Upload completo:",
        file.url,
        "por",
        metadata.adminId,
      );
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
