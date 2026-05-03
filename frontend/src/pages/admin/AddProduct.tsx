import { ProductBasicDetails } from '../../features/adminProducts/components/ProductBasicDetails';
import { ProductClassificationPanel } from '../../features/adminProducts/components/ProductClassificationPanel';
import { ProductCreateImagesPanel } from '../../features/adminProducts/components/ProductCreateImagesPanel';
import { ProductEditorHeader } from '../../features/adminProducts/components/ProductEditorHeader';
import { ProductInitialVariantForm } from '../../features/adminProducts/components/ProductInitialVariantForm';
import { ProductMediaEditor } from '../../features/adminProducts/components/ProductMediaEditor';
import { ProductVariantsEditor } from '../../features/adminProducts/components/ProductVariantsEditor';
import { useAdminProductEditor } from '../../features/adminProducts/hooks/useAdminProductEditor';

export default function AddProduct() {
  const editor = useAdminProductEditor();

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 pb-10">
      <ProductEditorHeader
        isEditMode={editor.isEditMode}
        loading={editor.loading}
        loadingProduct={editor.loadingProduct}
        onSave={editor.handleSaveProduct}
      />

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
              onChange={editor.updateMediaDraft}
            />
          )}
        </div>
      </div>
    </div>
  );
}
