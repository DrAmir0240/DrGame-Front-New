"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import api from "@/api/api";
import type { StoreProduct } from "../../types";
import type { Product } from "@/features/admin/inventory/products/types";
import type { PaginatedResponse } from "@/features/admin/website-home/types";

interface Props {
  open: boolean;
  editing: StoreProduct | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; product_id: number }) => Promise<void>;
}

export function ProductFormDialog({
  open,
  editing,
  loading,
  onClose,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setProduct({
        id: editing.product_id,
        title: editing.product_title,
        main_img: editing.product_main_img,
        description: "",
        category: 0,
        price: editing.product_price,
        stock: editing.product_stock,
        min_stock: 0,
        supplier: [],
        units_sold: 0,
        created_at: "",
        updated_at: "",
        is_deleted: false,
      });
    } else {
      setTitle("");
      setProduct(null);
    }
    setSearch("");
    setResults([]);
    setError("");
  }, [editing, open]);

  useEffect(() => {
    if (!search || search.length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await api.get<PaginatedResponse<Product>>(
          "/inventory/products/search/",
          { params: { search } }
        );
        setResults(res.data.results || (res.data as unknown as Product[]));
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) {
      setError("انتخاب کالای پایه الزامی است");
      return;
    }
    await onSubmit({ title: title.trim(), product_id: product.id });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش محصول فروشگاه" : "محصول فروشگاه جدید"}
      description="کالای انبار را برای نمایش در فروشگاه انتخاب کنید"
      className="max-w-md"
      footer={
        <div className="flex w-full gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            form="store-product-form"
            className="flex-1 gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : editing ? (
              "ذخیره تغییرات"
            ) : (
              "ایجاد"
            )}
          </Button>
        </div>
      }
    >
      <form
        id="store-product-form"
        onSubmit={submit}
        className="space-y-4"
      >
        <Input
          id="title"
          label="عنوان فروشگاه"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="مثلاً: هدفون بی‌سیم سونی"
        />

        <div>
          <label className="mb-2 block text-sm font-medium">
            کالای پایه (از انبار)
          </label>

          {product ? (
            <div className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800/50">
              <div className="flex items-center gap-2">
                {product.main_img && (
                  <img
                    src={product.main_img}
                    alt=""
                    className="h-8 w-8 rounded object-cover"
                  />
                )}
                <span className="font-medium">{product.title}</span>
              </div>
              <button
                type="button"
                onClick={() => setProduct(null)}
                className="text-muted-foreground hover:text-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجوی کالا با حداقل ۲ حرف..."
                  className="w-full rounded-md border border-neutral-200 bg-transparent py-2 pr-9 pl-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-secondary-600"
                />
              </div>
              {searching && (
                <p className="mt-1 text-xs text-muted-foreground">
                  در حال جستجو...
                </p>
              )}
              {results.length > 0 && (
                <ul className="mt-2 max-h-48 overflow-y-auto rounded-md border border-neutral-200 dark:border-neutral-700">
                  {results.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setProduct(item);
                          setSearch("");
                          setResults([]);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-right hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      >
                        {item.main_img && (
                          <img
                            src={item.main_img}
                            alt=""
                            className="h-8 w-8 rounded object-cover"
                          />
                        )}
                        <span className="flex-1">{item.title}</span>
                        <span className="text-xs text-muted-foreground">
                          موجودی: {item.stock}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {error && <p className="mt-1 text-xs text-error-500">{error}</p>}
        </div>
      </form>
    </Dialog>
  );
}
