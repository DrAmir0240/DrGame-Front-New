# admin/orders — سیستم سفارشات

## هدف
موتور سفارشات مبتنی بر «دسته → مرحله (stage) → اکشن» برای سه نوع سفارش: `sony-account`، `repair`، `product` (پیشوند `OrderPrefix`). شامل پیکربندی گردش کار و صف کاری کارمندان.
مسیرها: `/admin/orders`, `/config`, `/new`, `/product`, `/repair`, `/sony-account`, `/[id]`

## ساختار
```
orders/
├── apis/index.ts          # همه هوک‌ها با BASE="/orders" + prefixUrl(prefix, path)
├── types.d.ts · constants.ts · index.tsx
├── components/            # OrdersTable, OrderFilters
└── modules/
    ├── config/            # ConfigTab: دسته‌بندی‌ها/مراحل/اکشن‌ها
    ├── employee-orders/   # صف مراحل من + جزئیات سفارش + تایم‌لاین
    ├── new-order/         # ثبت سفارش جدید (آیتم‌ها، خلاصه مالی، پیک)
    └── order-details/     # جزئیات: آیتم‌ها، خلاصه مالی، StatusTimeline
```

## اندپوینت‌ها (همگی با پیشوند `/orders/{prefix}/`)
### پیکربندی — دسته‌ها
| متد | مسیر | هوک |
|---|---|---|
| GET | `categories/` | `useCategoryList` |
| GET | `categories/{categoryId}/stages/` | `useCategoryStages` |
| POST | `categories/create/` | `useCreateCategory` |
| PATCH | `categories/{id}/update/` | `useUpdateCategory` |
| DELETE | `categories/{id}/delete/` | `useDeleteCategory` |

### پیکربندی — مراحل و اکشن‌ها
| متد | مسیر | هوک |
|---|---|---|
| GET | `stages/{stageId}/` | `useStageDetail` |
| POST | `stages/create/` | `useCreateStage` |
| PATCH | `stages/{id}/update/` · DELETE `stages/{id}/delete/` | `useUpdateStage` / `useDeleteStage` |
| POST | `stage-actions/create/` | `useCreateAction` |
| PATCH | `stage-actions/{id}/update/` · DELETE `stage-actions/{id}/delete/` | `useUpdateAction` / `useDeleteAction` |

### عملیات کارمند
| متد | مسیر | هوک |
|---|---|---|
| GET | `my-stages/` | `useMyStages` |
| GET | `orders/by-stage/{stageId}/` | `useOrdersByStage` |
| GET | `orders/{orderId}/` | `useOrderDetail` (`SonyAccountOrderDetail \| RepairOrderDetail \| ProductOrderDetail`) |
| GET | `orders/{orderId}/actions/` | `useOrderActions` |
| POST | `orders/{orderId}/execute-action/` | `useExecuteAction` |
| POST | `orders/{orderId}/advance-stage/` `{note?}` | `useAdvanceStage` |
| GET | `{orderId}/stage-logs/` | `useStageLogs` |
| POST | `{orderId}/actions/` | `useGuideExecuteAction` |

## نکات
- کلیدهای کوئری: `["my-stages",prefix]`, `["orders-by-stage",prefix,stageId]`, `["order-detail",prefix,orderId]`, `["stage-logs",prefix,orderId]`, ...
- `extractList` پاسخ آرایه/paginated را یکدست می‌کند.
- `advance-stage` خطای `response.data.detail` را toast می‌کند؛ اجرای اکشن هر سه کوئری detail/actions/logs را invalidate می‌کند.
