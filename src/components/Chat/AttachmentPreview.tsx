"use client";

export default function AttachmentPreview({ url }: { url: string }) {
  return (
    <div className="w-32 h-32 bg-gray-200 rounded-md overflow-hidden">
      <img
        src={url}
        alt="Attachment Preview"
        className="w-full h-full object-cover"
      />
    </div>
  );
}