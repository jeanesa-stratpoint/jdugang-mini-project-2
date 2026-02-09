import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      
      // FIX: Use ufsUrl to stop the deprecation warning
      // Note: 'file.url' still works but logs warnings. 
      return { url: file.ufsUrl }; 
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;