"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Modal from "@/components/shared/Modal";
import { updateMyBaleChatIdApi } from "@/shared/api/auth";

interface BaleChatIdButtonProps {
  currentBaleChatId?: string | null;
  isProfileLoading: boolean;
}

export default function BaleChatIdButton({
  currentBaleChatId,
  isProfileLoading,
}: BaleChatIdButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [baleChatId, setBaleChatId] = useState("");
  const queryClient = useQueryClient();
  const { mutateAsync: updateBaleChatId, isPending } = useMutation({
    mutationFn: updateMyBaleChatIdApi,
  });

  const openEditor = () => {
    setBaleChatId(currentBaleChatId ?? "");
    setIsOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const updatedProfile = await updateBaleChatId({
        bale_chat_id: baleChatId.trim() || null,
      });
      queryClient.setQueryData(["profile"], updatedProfile);
      setIsOpen(false);
      toast.success("شناسه بله ذخیره شد");
    } catch {
      toast.error("ذخیره شناسه بله انجام نشد");
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
        <button
          type="button"
          onClick={openEditor}
          disabled={isProfileLoading}
          className="rounded-sm border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {currentBaleChatId ? "ویرایش شناسه بله" : "افزودن شناسه بله"}
        </button>
        <span className="text-xs text-gray-500">
          شناسه فعلی: {currentBaleChatId || "ثبت نشده"}
        </span>
      </div>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title="تنظیم شناسه بله"
      >
        <form onSubmit={handleSubmit} className="mt-5 space-y-4" dir="rtl">
          <label
            htmlFor="bale-chat-id"
            className="block text-sm font-medium text-gray-700"
          >
            شناسه بله
          </label>
          <input
            id="bale-chat-id"
            type="text"
            value={baleChatId}
            onChange={(event) => setBaleChatId(event.target.value)}
            placeholder="Bale ChatId"
            autoComplete="off"
            autoCapitalize="none"
            dir="ltr"
            className="h-11 w-full rounded-lg border border-gray-200 px-3 text-left text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <p className="text-xs text-gray-500">
            برای پاک‌کردن شناسه، فیلد را خالی ذخیره کنید.
          </p>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "در حال ذخیره..." : "ذخیره"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="flex-1 rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              انصراف
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
