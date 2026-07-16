"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  Plus,
  Trash2,
  Pencil,
  Upload,
} from "lucide-react";
import { Badge, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { ConfirmModal, DataTable, DataTableColumn } from "@/components/shared";
import api from "@/api/api";
import { getStockStatus } from "../types";
import type {
  Product,
  ProductEntity,
  ProductImage,
  ProductChoices,
} from "../types";
import type { PaginatedResponse } from "../../shared/types";
import { formatPrice } from "@/utils/format";
import EntityFormDialog from "./EntityFormDialog";

interface Props {
  product: Product;
  choices: ProductChoices | null;
  onBack: () => void;
  onRefresh: () => void;
}

export default function ProductDetailPage({
  product,
  choices,
  onBack,
  onRefresh,
}: Props) {
  const [entities, setEntities] = useState<ProductEntity[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [entityCount, setEntityCount] = useState(0);
  const [isLoadingEntities, setIsLoadingEntities] = useState(true);
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const [openEntityForm, setOpenEntityForm] = useState(false);
  const [editingEntity, setEditingEntity] = useState<ProductEntity | null>(null);
  const [deleteEntity, setDeleteEntity] = useState<ProductEntity | null>(null);
  const [deleteImage, setDeleteImage] = useState<ProductImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchEntities = useCallback(async () => {
    setIsLoadingEntities(true);
    try {
      const res = await api.get<PaginatedResponse<ProductEntity>>(
        `/inventory/products/${product.id}/entities/`,
        { params: { limit: 100 } }
      );
      setEntities(res.data.results);
      setEntityCount(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingEntities(false);
    }
  }, [product.id]);

  const fetchImages = useCallback(async () => {
    setIsLoadingImages(true);
    try {
      const res = await api.get<PaginatedResponse<ProductImage>>(
        `/inventory/products/${product.id}/images/`,
        { params: { limit: 100 } }
      );
      setImages(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingImages(false);
    }
  }, [product.id]);

  useEffect(() => {
    fetchEntities();
    fetchImages();
  }, [fetchEntities, fetchImages]);

  async function handleEntitySubmit(formData: FormData) {
    setLoading(true);
    try {
      if (editingEntity) {
        await api.patch(
          `/inventory/products/${product.id}/entities/${editingEntity.id}/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await api.post(
          `/inventory/products/${product.id}/entities/`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      setOpenEntityForm(false);
      setEditingEntity(null);
      fetchEntities();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleEntityDelete() {
    if (!deleteEntity) return;
    setLoading(true);
    try {
      await api.delete(
        `/inventory/products/${product.id}/entities/${deleteEntity.id}/`
      );
      setDeleteEntity(null);
      fetchEntities();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("img", file);
      formData.append("product", String(product.id));
      await api.post(
        `/inventory/products/${product.id}/images/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      fetchImages();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  async function handleImageDelete() {
    if (!deleteImage) return;
    setLoading(true);
    try {
      await api.delete(
        `/inventory/products/${product.id}/images/${deleteImage.id}/`
      );
      setDeleteImage(null);
      fetchImages();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const stockStatus = getStockStatus(product.stock, product.min_stock);
  const categoryTitle =
    choices?.categories.find((c) => c.id === product.category)?.title || "—";
  const supplierNames = product.supplier
    .map((id) => choices?.suppliers.find((s) => s.id === id)?.name)
    .filter(Boolean)
    .join(", ") || "—";

  const entityColumns: DataTableColumn<ProductEntity>[] = [
    {
      header: "شناسه یکتا",
      render: (r) => <span className="font-medium text-sm">{r.uni_id}</span>,
    },
    {
      header: "رنگ",
      render: (r) => <span className="text-sm">{r.color || "—"}</span>,
    },
    {
      header: "تاریخ ایجاد",
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {new Date(r.created_at).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      header: "",
      render: (r) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditingEntity(r);
              setOpenEntityForm(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteEntity(r)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">{product.title}</h2>
          <p className="text-sm text-muted-foreground">جزئیات کالا</p>
        </div>
      </div>

      <div className="bg-neutral-0 rounded-2xl border border-neutral-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">دسته‌بندی</span>
              <p className="text-sm font-medium">{categoryTitle}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">قیمت</span>
              <p className="text-sm font-semibold">
                {formatPrice(Number(product.price))}
              </p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">تامین‌کنندگان</span>
              <p className="text-sm">{supplierNames}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">موجودی</span>
              <div className="mt-1">
                <Badge
                  variant="outline"
                  className={`text-xs border ${stockStatus.color}`}
                >
                  {product.stock} — {stockStatus.label}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">حداقل موجودی</span>
              <p className="text-sm">{product.min_stock}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">فروش رفته</span>
              <p className="text-sm">{product.units_sold.toLocaleString("fa-IR")}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">توضیحات</span>
              <p className="text-sm">{product.description || "—"}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">تاریخ ایجاد</span>
              <p className="text-sm">
                {new Date(product.created_at).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="entities">
        <TabsList>
          <TabsTrigger value="entities">موجودی‌ها ({entityCount})</TabsTrigger>
          <TabsTrigger value="images">عکس‌ها ({images.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="entities" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setOpenEntityForm(true)} className="gap-2">
              <Plus className="w-4 h-4" /> موجودی جدید
            </Button>
          </div>
          <DataTable<ProductEntity>
            columns={entityColumns}
            data={entities}
            isLoading={isLoadingEntities}
            emptyMessage="موجودی ثبت نشده"
          />
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="flex justify-end">
            <div>
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                onClick={() => document.getElementById("image-upload")?.click()}
                disabled={uploadingImage}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                {uploadingImage ? "در حال آپلود..." : "آپلود عکس"}
              </Button>
            </div>
          </div>
          {isLoadingImages ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-neutral-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="group relative">
                  <img
                    src={img.img}
                    alt=""
                    className="w-full aspect-square object-cover rounded-xl border border-neutral-100"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 left-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setDeleteImage(img)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground text-sm">
              عکسی آپلود نشده
            </div>
          )}
        </TabsContent>
      </Tabs>

      <EntityFormDialog
        open={openEntityForm}
        editing={editingEntity}
        productId={product.id}
        onClose={() => {
          setOpenEntityForm(false);
          setEditingEntity(null);
        }}
        onSubmit={handleEntitySubmit}
        loading={loading}
      />

      <ConfirmModal
        open={!!deleteEntity}
        onOpenChange={(v) => !v && setDeleteEntity(null)}
        title="حذف موجودی"
        message={`آیا از حذف موجودی «${deleteEntity?.uni_id}» اطمینان دارید؟`}
        onConfirm={handleEntityDelete}
        loading={loading}
      />

      <ConfirmModal
        open={!!deleteImage}
        onOpenChange={(v) => !v && setDeleteImage(null)}
        title="حذف عکس"
        message="آیا از حذف این عکس اطمینان دارید؟"
        onConfirm={handleImageDelete}
        loading={loading}
      />
    </div>
  );
}
