"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  Button,
  Dialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import api from "@/api/api";
import type { InventoryMovement, MovementFormData } from "../types";
import type { MovementDirection, PaginatedResponse } from "../../shared/types";
import type { Product } from "../../products/types";

interface Props {
  open: boolean;
  editing: InventoryMovement | null;
  onClose: () => void;
  onSubmit: (data: MovementFormData) => void;
  loading?: boolean;
}

export default function MovementFormDialog({
  open,
  editing,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<MovementFormData>({
    product: null,
    product_entity: null,
    direction: "in",
  });
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<Product[]>([]);
  const [selectedProductTitle, setSelectedProductTitle] = useState("");

  useEffect(() => {
    if (editing) {
      setForm({
        product: editing.product,
        product_entity: editing.product_entity,
        direction: editing.direction,
      });
      setSelectedProductTitle(`محصول #${editing.product}`);
    } else {
      setForm({ product: null, product_entity: null, direction: "in" });
      setProductSearch("");
      setProductResults([]);
      setSelectedProductTitle("");
    }
  }, [editing, open]);

  useEffect(() => {
    if (!productSearch || productSearch.length < 2) {
      setProductResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await api.get<PaginatedResponse<Product>>(
          "/inventory/products/search/",
          { params: { search: productSearch } }
        );
        setProductResults(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [productSearch]);

  function handleProductSelect(product: Product) {
    setForm({ ...form, product: product.id });
    setSelectedProductTitle(product.title);
    setProductSearch("");
    setProductResults([]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش گردش" : "گردش جدید"}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            form="movement-form"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "در حال ذخیره..." : editing ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="movement-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>
            کالا <span className="text-destructive">*</span>
          </Label>
          {selectedProductTitle && !productSearch ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium flex-1">
                {selectedProductTitle}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedProductTitle("");
                  setForm({ ...form, product: null });
                }}
              >
                تغییر
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pr-10"
                placeholder="جستجوی کالا..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
              {productResults.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-background border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {productResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="w-full text-right px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={() => handleProductSelect(p)}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>
            جهت <span className="text-destructive">*</span>
          </Label>
          <Select
            value={form.direction}
            onValueChange={(v) =>
              setForm({ ...form, direction: v as MovementDirection })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in">ورودی</SelectItem>
              <SelectItem value="out">خروجی</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>
    </Dialog>
  );
}
