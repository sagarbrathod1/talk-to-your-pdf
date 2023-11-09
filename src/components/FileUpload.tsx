"use client";

import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      fileKey,
      fileName,
    }: {
      fileKey: string;
      fileName: string;
    }) => {
      const response = await axios.post("/api/create-conversation", {
        fileKey,
        fileName,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large!");
        alert("File size must be under 10MB");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.fileKey || !data?.fileName) {
          toast.error("Something went wrong!");
          alert("Something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: ({ conversationId }) => {
            toast.success("Conversation created!");
            router.push("/conversation/${conversationId}");
          },
          onError: (error) => {
            toast.error("Error creating conversation!");
            console.log(error);
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center",
        })}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 mr-2 text-blue-500 animate-spin" />
            <p className="mt-2 text-sm text-slate-400">
              Sharing PDF with GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 mr-2 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Upload PDF</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
