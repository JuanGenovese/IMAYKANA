import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const supabase = await createSupabaseServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sin autorización");
      return { adminId: user.email };
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
