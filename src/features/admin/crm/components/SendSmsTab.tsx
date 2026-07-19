"use client";

import { useState, useEffect, useCallback } from "react";
import { Send, Search } from "lucide-react";
import {
  Badge,
  Button,
  Checkbox,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/api/api";
import { useSendSms, useCustomerList, useB2BCustomerList } from "../apis";
import { getCustomerType, customerTypeTabs, LIMIT } from "../constants";
import type { Customer, PaginatedResponse } from "../types";

export default function SendSmsTab() {
  const [customerType, setCustomerType] = useState("normal");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [sendTime, setSendTime] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const filters = { search: debouncedSearch, limit: 1000, offset: 0 };

  const normalQuery = useCustomerList(filters);
  const b2bQuery = useB2BCustomerList(filters);

  const isB2B = customerType === "b2b";
  const query = isB2B ? b2bQuery : normalQuery;
  const customers = query.data?.results ?? [];

  const sendSms = useSendSms();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setSelectedIds([]);
    setSelectAll(false);
    setSearch("");
    setDebouncedSearch("");
  }, [customerType]);

  useEffect(() => {
    if (selectAll) {
      setSelectedIds(customers.map((c) => c.id));
    } else if (selectedIds.length === customers.length && customers.length > 0) {
    } else {
    }
  }, [selectAll]);

  function toggleSelectAll() {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(customers.map((c) => c.id));
      setSelectAll(true);
    }
  }

  function toggleCustomer(id: number) {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setSelectAll(next.length === customers.length && customers.length > 0);
      return next;
    });
  }

  function handleSend() {
    if (!message.trim() || selectedIds.length === 0) return;

    const payload: any = {
      message: message.trim(),
      customer_ids: selectedIds,
    };
    if (sendTime) payload.send_time = new Date(sendTime).toISOString();

    sendSms.mutate(payload, {
      onSuccess: () => {
        setMessage("");
        setSendTime("");
        setSelectedIds([]);
        setSelectAll(false);
      },
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <Tabs
          dir="rtl"
          value={customerType}
          onValueChange={setCustomerType}
          className="mb-4"
        >
          <TabsList>
            {customerTypeTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative mb-3">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pr-10"
            placeholder="جستجوی مشتری..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
          <Checkbox
            checked={selectAll}
            onCheckedChange={toggleSelectAll}
          />
          <span className="text-sm font-medium">
            انتخاب همه ({customers.length} مورد)
          </span>
          {selectedIds.length > 0 && (
            <Badge variant="outline" className="text-xs mr-2">
              {selectedIds.length} انتخاب شده
            </Badge>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto mt-2 space-y-1">
          {query.isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))
          ) : customers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              مشتری یافت نشد
            </p>
          ) : (
            customers.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
              >
                <Checkbox
                  checked={selectedIds.includes(c.id)}
                  onCheckedChange={() => toggleCustomer(c.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {c.full_name}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] border ${getCustomerType(c.has_b2b).className}`}
                    >
                      {getCustomerType(c.has_b2b).label}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.phone}</span>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            متن پیامک <span className="text-destructive">*</span>
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="متن پیامک را بنویسید..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">زمان ارسال (اختیاری)</label>
          <Input
            type="datetime-local"
            value={sendTime}
            onChange={(e) => setSendTime(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={!message.trim() || selectedIds.length === 0 || sendSms.isPending}
          className="gap-2 w-full"
        >
          <Send className="w-4 h-4" />
          {sendSms.isPending
            ? "در حال ارسال..."
            : `ارسال پیامک به ${selectedIds.length} مشتری`}
        </Button>
      </div>
    </div>
  );
}
