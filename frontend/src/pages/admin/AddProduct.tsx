import { AlertTriangle } from 'lucide-react';
import { ProductBasicDetails } from '../../features/admin/products/components/ProductBasicDetails';
import { ProductClassificationPanel } from '../../features/admin/products/components/ProductClassificationPanel';
import { ProductCreateImagesPanel } from '../../features/admin/products/components/ProductCreateImagesPanel';
import { ProductEditorHeader } from '../../features/admin/products/components/ProductEditorHeader';
import { ProductInitialVariantForm } from '../../features/admin/products/components/ProductInitialVariantForm';
import { ProductMediaEditor } from '../../features/admin/products/components/ProductMediaEditor';
import { ProductVariantsEditor } from '../../features/admin/products/components/ProductVariantsEditor';
import { ProductDescriptionBlocksEditor } from '../../features/admin/products/components/ProductDescriptionBlocksEditor';
import { ProductSpecificationsEditor } from '../../features/admin/products/components/ProductSpecificationsEditor';
import { useAdminProductEditor } from '../../features/admin/products/hooks/useAdminProductEditor';
import { Container, Section } from "../../components/common";

export default function AddProduct() {
  const editor = useAdminProductEditor();

  return (
    <Container size="wide">
      <Section spacing="md" className="space-y-6">
      <ProductEditorHeader
        isEditMode={editor.isEditMode}
        loading={editor.loading}
        loadingProduct={editor.loadingProduct}
        onSave={editor.handleSaveProduct}
      />

      {editor.hasExampleMedia && (
        <div className="flex items-center gap-2 rounded-lg border border-warning-soft bg-warning-soft px-4 py-3 text-sm font-bold text-warning">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          Sản phẩm đang có ảnh mẫu (example.com). Upload ảnh thật qua Cloudinary để thay thế, sau đó nhấn Save cho từng ảnh.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <ProductBasicDetails
            isEditMode={editor.isEditMode}
            formValues={editor.formValues}
            productActive={editor.productActive}
            onActiveChange={editor.setProductActive}
            onChange={editor.handleChange}
          />

          {!editor.isEditMode && (
            <ProductInitialVariantForm
              formValues={editor.formValues}
              onChange={editor.handleChange}
            />
          )}

          {editor.isEditMode && (
            <ProductVariantsEditor
              variants={editor.variants}
              savingVariantIndex={editor.savingVariantIndex}
              onAdd={editor.handleAddVariantRow}
              onSave={editor.handleSaveVariant}
              onDelete={editor.handleDeleteVariant}
              onChange={editor.updateVariantDraft}
            />
          )}
        </div>

        <div className="space-y-6">
          <ProductClassificationPanel
            formValues={editor.formValues}
            brands={editor.brands}
            brandsLoading={editor.brandsLoading}
            brandsError={editor.brandsError}
            categories={editor.categories}
            categoriesLoading={editor.categoriesLoading}
            categoriesError={editor.categoriesError}
            onChange={editor.handleChange}
          />

          {!editor.isEditMode && (
            <ProductCreateImagesPanel
              formValues={editor.formValues}
              uploadingKey={editor.uploadingKey}
              onAdd={editor.handleAddMediaUrl}
              onRemove={editor.handleRemoveMediaUrl}
              onUrlChange={editor.handleMediaUrlChange}
              onUpload={editor.handleUploadCreateMediaFile}
              onUploadMany={editor.handleUploadCreateMediaFiles}
            />
          )}

          {editor.isEditMode && (
            <ProductMediaEditor
              mediaItems={editor.mediaItems}
              uploadingKey={editor.uploadingKey}
              savingMediaIndex={editor.savingMediaIndex}
              onAdd={editor.handleAddMediaRow}
              onSave={editor.handleSaveMedia}
              onDelete={editor.handleDeleteMedia}
              onUpload={editor.handleUploadEditMediaFile}
              onUploadMany={editor.handleUploadEditMediaFiles}
              onChange={editor.updateMediaDraft}
            />
          )}
        </div>
      </div>

      {editor.isEditMode && editor.product && (
        <div className="mt-6 space-y-6">
          <ProductDescriptionBlocksEditor
            productId={editor.productId!}
            initialBlocks={editor.product.descriptionBlocks || []}
            onReload={() => editor.reloadProduct(editor.productId!)}
          />

          <ProductSpecificationsEditor
            productId={editor.productId!}
            initialSpecs={editor.product.specifications || []}
            onReload={() => editor.reloadProduct(editor.productId!)}
          />
        </div>
      )}
      </Section>
    </Container>
  );
}
