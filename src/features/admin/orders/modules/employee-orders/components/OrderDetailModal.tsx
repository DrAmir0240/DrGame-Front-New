"use client";

import { useState, useMemo } from "react";
import moment from "moment";
import { CheckCircle, Clock, Send, ChevronRight, FileText, History } from "lucide-react";
import { Button } from "@/components/ui";
import { Dialog } from "@/components/ui";
import type {
  OrderPrefix,
  SonyAccountOrderDetail,
  RepairOrderDetail,
  ProductOrderDetail,
  OrderAction,
} from "../../../types";
import { useOrderDetail, useOrderActions, useExecuteAction, useAdvanceStage } from "../../../apis";
import { formatPrice } from "@/utils/format";

interface Props {
  open: boolean;
  onClose: () => void;
  orderId: number | null;
  orderPrefix: OrderPrefix;
}

type OrderDetail = SonyAccountOrderDetail | RepairOrderDetail | ProductOrderDetail;

function isSonyAccountOrder(d: OrderDetail): d is SonyAccountOrderDetail {
  return "source" in d && "items" in d && "consoles" in d;
}

function isRepairOrder(d: OrderDetail): d is RepairOrderDetail {
  return "repair_fee" in d && "devices" in d;
}

function isProductOrder(d: OrderDetail): d is ProductOrderDetail {
  return "items" in d && !("consoles" in d) && !("repair_fee" in d);
}

export default function OrderDetailModal({ open, onClose, orderId, orderPrefix }: Props) {
  const [activeLogTab, setActiveLogTab] = useState<"actions" | "stages">("actions");
  const { data: order, isLoading: orderLoading } = useOrderDetail(orderPrefix, open ? orderId : null);
  const { data: actions = [], isLoading: actionsLoading } = useOrderActions(orderPrefix, open ? orderId : null);
  const executeAction = useExecuteAction(orderPrefix);
  const advanceStage = useAdvanceStage(orderPrefix);

  const [actionValues, setActionValues] = useState<Record<number, unknown>>({});
  const [actionNotes, setActionNotes] = useState<Record<number, string>>({});

  const canAdvance = useMemo(() => {
    return actions.filter((a) => a.is_required).every((a) => a.is_done);
  }, [actions]);

  const pendingCount = useMemo(() => {
    return actions.filter((a) => a.is_required && !a.is_done).length;
  }, [actions]);

  async function handleExecuteAction(action: OrderAction) {
    if (!orderId) return;
    const payload: any = {
      orderId,
      action_id: action.id,
      note: actionNotes[action.id] || undefined,
    };

    const val = actionValues[action.id];
    if (val !== undefined && val !== null && val !== "") {
      payload.value = val;
    }

    try {
      await executeAction.mutateAsync(payload);
      setActionValues((prev) => {
        const next = { ...prev };
        delete next[action.id];
        return next;
      });
      setActionNotes((prev) => {
        const next = { ...prev };
        delete next[action.id];
        return next;
      });
    } catch {}
  }

  async function handleAdvanceStage() {
    if (!orderId) return;
    try {
      await advanceStage.mutateAsync({
        orderId,
        note: actionNotes[-1] || undefined,
      });
      onClose();
    } catch {}
  }

  function renderActionInput(action: OrderAction) {
    if (action.is_done) {
      return (
        <div className="flex items-center gap-1.5 text-green-600 text-xs">
          <CheckCircle className="w-4 h-4" />
          <span>انجام شده</span>
        </div>
      );
    }

    switch (action.action_type) {
      case "manual_confirm":
        return (
          <Button
            size="sm"
            onClick={() => handleExecuteAction(action)}
            disabled={executeAction.isPending}
            className="gap-1 h-7 text-xs"
          >
            <CheckCircle className="w-3 h-3" />
            {executeAction.isPending ? "در حال انجام..." : "تایید"}
          </Button>
        );

      case "add_note":
        return (
          <div className="flex gap-2 items-end">
            <input
              type="text"
              placeholder="یادداشت..."
              value={actionValues[action.id] as string || ""}
              onChange={(e) => setActionValues({ ...actionValues, [action.id]: e.target.value })}
              className="flex h-8 rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm flex-1"
            />
            <Button
              size="sm"
              onClick={() => handleExecuteAction(action)}
              disabled={executeAction.isPending || !actionValues[action.id]}
              className="h-8"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        );

      case "update_order_field":
        return (
          <div className="flex gap-2 items-end">
            <input
              type={action.target_field === "repair_fee" || action.target_field === "final_amount" ? "number" : "text"}
              placeholder={action.target_field || "مقدار"}
              value={actionValues[action.id] as string || ""}
              onChange={(e) => setActionValues({ ...actionValues, [action.id]: e.target.value })}
              className="flex h-8 rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm flex-1"
            />
            <Button
              size="sm"
              onClick={() => handleExecuteAction(action)}
              disabled={executeAction.isPending || actionValues[action.id] === undefined || actionValues[action.id] === ""}
              className="h-8"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        );

      case "update_order_item_field":
        return (
          <div className="flex gap-2 items-end">
            <input
              type="text"
              placeholder={`مقدار ${action.target_field || ""}`}
              value={actionValues[action.id] as string || ""}
              onChange={(e) => setActionValues({ ...actionValues, [action.id]: e.target.value })}
              className="flex h-8 rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm flex-1"
            />
            <Button
              size="sm"
              onClick={() => handleExecuteAction(action)}
              disabled={executeAction.isPending}
              className="h-8"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={order ? `سفارش #${order.id}` : "جزئیات سفارش"}
      className="max-w-2xl"
    >
      {orderLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">در حال بارگذاری...</div>
      ) : !order ? (
        <div className="py-8 text-center text-sm text-muted-foreground">سفارش یافت نشد</div>
      ) : (
        <div className="space-y-5">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground text-xs">مشتری: </span>
              <span className="font-medium">{"customer_detail" in order ? order.customer_detail?.full_name : "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">مرحله: </span>
              <span className="font-medium">{order.stage_detail?.title}</span>
            </div>
            {"source" in order && (
              <div>
                <span className="text-muted-foreground text-xs">منبع: </span>
                <span className="font-medium">{(order as SonyAccountOrderDetail).source}</span>
              </div>
            )}
            {"amount" in order && (
              <div>
                <span className="text-muted-foreground text-xs">مبلغ: </span>
                <span className="font-semibold">{formatPrice((order as any).amount)}</span>
              </div>
            )}
            {"repair_fee" in order && (
              <>
                <div>
                  <span className="text-muted-foreground text-xs">هزینه تعمیر: </span>
                  <span className="font-medium">{formatPrice((order as RepairOrderDetail).repair_fee)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">مبلغ نهایی: </span>
                  <span className="font-semibold">{formatPrice((order as RepairOrderDetail).final_amount)}</span>
                </div>
              </>
            )}
            <div>
              <span className="text-muted-foreground text-xs">تاریخ: </span>
              <span className="text-xs">{moment(order.created_at).format("YYYY/MM/DD HH:mm")}</span>
            </div>
          </div>

          {/* Items */}
          {"items" in order && order.items && order.items.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> آیتم‌ها
              </h4>
              <div className="border border-neutral-100 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      {isSonyAccountOrder(order) ? (
                        <>
                          <th className="py-2 px-3 text-right font-medium">اکانت</th>
                          <th className="py-2 px-3 text-right font-medium">کارمند</th>
                        </>
                      ) : isProductOrder(order) ? (
                        <>
                          <th className="py-2 px-3 text-right font-medium">محصول</th>
                          <th className="py-2 px-3 text-right font-medium">قیمت واحد</th>
                          <th className="py-2 px-3 text-right font-medium">تعداد</th>
                        </>
                      ) : null}
                    </tr>
                  </thead>
                  <tbody>
                    {isSonyAccountOrder(order) && order.items.map((item) => (
                      <tr key={item.id} className="border-b border-neutral-50">
                        <td className="py-2 px-3">{item.sony_account || "—"}</td>
                        <td className="py-2 px-3">{item.employee || "—"}</td>
                      </tr>
                    ))}
                    {isProductOrder(order) && order.items.map((item) => (
                      <tr key={item.id} className="border-b border-neutral-50">
                        <td className="py-2 px-3">{item.title}</td>
                        <td className="py-2 px-3">{formatPrice(item.unit_price)}</td>
                        <td className="py-2 px-3">{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Consoles (Sony Account only) */}
          {"consoles" in order && order.consoles && order.consoles.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">کنسول‌ها</h4>
              <div className="border border-neutral-100 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="py-2 px-3 text-right font-medium">شماره سریال</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.consoles.map((c) => (
                      <tr key={c.id} className="border-b border-neutral-50">
                        <td className="py-2 px-3 font-mono text-xs">{c.serial_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Devices (Repair only) */}
          {"devices" in order && order.devices && order.devices.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">دستگاه‌ها</h4>
              <div className="border border-neutral-100 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-100">
                      <th className="py-2 px-3 text-right font-medium">عنوان</th>
                      <th className="py-2 px-3 text-right font-medium">شماره سریال</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.devices.map((d) => (
                      <tr key={d.id} className="border-b border-neutral-50">
                        <td className="py-2 px-3">{d.title}</td>
                        <td className="py-2 px-3 font-mono text-xs">{d.serial_number}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> اکشن‌های مرحله فعلی
              {pendingCount > 0 && (
                <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">
                  {pendingCount} باقیمانده
                </span>
              )}
            </h4>
            {actionsLoading ? (
              <p className="text-xs text-muted-foreground">در حال بارگذاری...</p>
            ) : actions.length === 0 ? (
              <p className="text-xs text-muted-foreground">اکشنی موجود نیست</p>
            ) : (
              <div className="space-y-2">
                {actions.sort((a, b) => a.order - b.order).map((action) => (
                  <div
                    key={action.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      action.is_done ? "border-green-100 bg-green-50/30" : "border-neutral-100"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{action.title}</span>
                        {action.is_required && !action.is_done && (
                          <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded">اجباری</span>
                        )}
                      </div>
                      {action.target_field && (
                        <span className="text-[10px] text-muted-foreground">{action.target_field}</span>
                      )}
                    </div>
                    <div className="shrink-0">{renderActionInput(action)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Advance Stage */}
          <div className="border-t border-neutral-100 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="یادداشت انتقال مرحله (اختیاری)"
                value={actionNotes[-1] || ""}
                onChange={(e) => setActionNotes({ ...actionNotes, [-1]: e.target.value })}
                className="flex h-9 rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm flex-1"
              />
              <Button
                onClick={handleAdvanceStage}
                disabled={!canAdvance || advanceStage.isPending}
                className="gap-1.5"
              >
                <ChevronRight className="w-4 h-4" />
                {advanceStage.isPending ? "در حال انتقال..." : "انتقال به مرحله بعدی"}
              </Button>
            </div>
            {!canAdvance && pendingCount > 0 && (
              <p className="text-xs text-amber-600">
                {pendingCount} اکشن اجباری باقیمانده است
              </p>
            )}
          </div>

          {/* Logs */}
          <div>
            <div className="flex gap-1 border-b border-neutral-200 mb-3">
              <button
                onClick={() => setActiveLogTab("actions")}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
                  activeLogTab === "actions"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-neutral-700"
                }`}
              >
                <History className="w-3 h-3 inline ml-1" />
                تاریخچه اکشن‌ها
              </button>
              <button
                onClick={() => setActiveLogTab("stages")}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 -mb-px transition-colors ${
                  activeLogTab === "stages"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-neutral-700"
                }`}
              >
                <History className="w-3 h-3 inline ml-1" />
                تاریخچه مراحل
              </button>
            </div>

            {activeLogTab === "actions" && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {"action_logs" in order && order.action_logs.length === 0 && (
                  <p className="text-xs text-muted-foreground">تاریخچه‌ای موجود نیست</p>
                )}
                {"action_logs" in order && order.action_logs.map((log) => (
                  <div key={log.id} className="text-xs flex items-start gap-2 py-1.5 border-b border-neutral-50 last:border-0">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium">{log.action_title}</span>
                      <span className="text-muted-foreground"> توسط {log.performed_by_name}</span>
                      {log.note && <span className="text-muted-foreground block">یادداشت: {log.note}</span>}
                      <span className="text-muted-foreground block">{moment(log.created_at).format("YYYY/MM/DD HH:mm")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeLogTab === "stages" && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {"stage_logs" in order && order.stage_logs.length === 0 && (
                  <p className="text-xs text-muted-foreground">تاریخچه‌ای موجود نیست</p>
                )}
                {"stage_logs" in order && order.stage_logs.map((log) => (
                  <div key={log.id} className="text-xs flex items-start gap-2 py-1.5 border-b border-neutral-50 last:border-0">
                    <ChevronRight className="w-3 h-3 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium">{log.from_stage_title}</span>
                      <span className="text-muted-foreground"> → </span>
                      <span className="font-medium">{log.to_stage_title}</span>
                      <span className="text-muted-foreground"> توسط {log.changed_by_name}</span>
                      {log.note && <span className="text-muted-foreground block">یادداشت: {log.note}</span>}
                      <span className="text-muted-foreground block">{moment(log.created_at).format("YYYY/MM/DD HH:mm")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Dialog>
  );
}
