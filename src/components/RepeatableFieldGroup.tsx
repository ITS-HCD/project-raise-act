import { useState } from 'react';
import { NysButton } from './wrappers/NysButton';
import styles from './RepeatableFieldGroup.module.css';

interface RepeatableFieldGroupProps<T> {
  items: T[];
  onAdd: (item: T) => void;
  onUpdate: (index: number, item: T) => void;
  onRemove: (index: number) => void;
  renderForm: (item: T, onChange: (item: T) => void) => React.ReactNode;
  renderSummary: (item: T, index: number) => React.ReactNode;
  emptyItem: T;
  addLabel?: string;
  entryLabel?: string;
}

export function RepeatableFieldGroup<T>({
  items,
  onAdd,
  onUpdate,
  onRemove,
  renderForm,
  renderSummary,
  emptyItem,
  addLabel = '+ Add',
  entryLabel = 'entry',
}: RepeatableFieldGroupProps<T>) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftItem, setDraftItem] = useState<T>(emptyItem);

  function handleOpenAdd() {
    setDraftItem(emptyItem);
    setEditingIndex(-1);
  }

  function handleOpenEdit(index: number) {
    setDraftItem(items[index]);
    setEditingIndex(index);
  }

  function handleSave() {
    if (editingIndex === -1) {
      onAdd(draftItem);
    } else if (editingIndex !== null) {
      onUpdate(editingIndex, draftItem);
    }
    setEditingIndex(null);
    setDraftItem(emptyItem);
  }

  function handleCancel() {
    setEditingIndex(null);
    setDraftItem(emptyItem);
  }

  return (
    <div>
      <div aria-live="polite" className={styles.list}>
        {items.map((item, index) => {
          if (editingIndex === index) {
            return (
              <div key={index} className={styles.formPanel}>
                {renderForm(draftItem, setDraftItem)}
                <div className={styles.formActions}>
                  <NysButton
                    label="Save"
                    variant="filled"
                    size="sm"
                    type="button"
                    onClick={handleSave}
                  />
                  <NysButton
                    label="Cancel"
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={handleCancel}
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={index}
              className={styles.card}
              aria-label={`${entryLabel} ${index + 1}`}
            >
              <div className={styles.cardContent}>
                {renderSummary(item, index)}
              </div>
              <div className={styles.cardActions}>
                <NysButton
                  label="Edit"
                  variant="text"
                  size="sm"
                  type="button"
                  ariaLabel={`Edit ${entryLabel} ${index + 1}`}
                  onClick={() => handleOpenEdit(index)}
                />
                <NysButton
                  label="Remove"
                  variant="text"
                  size="sm"
                  type="button"
                  ariaLabel={`Remove ${entryLabel} ${index + 1}`}
                  onClick={() => onRemove(index)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {editingIndex === -1 && (
        <div className={styles.formPanel} style={{ marginTop: items.length > 0 ? 'var(--nys-space-200)' : undefined }}>
          {renderForm(draftItem, setDraftItem)}
          <div className={styles.formActions}>
            <NysButton
              label="Save"
              variant="filled"
              size="sm"
              type="button"
              onClick={handleSave}
            />
            <NysButton
              label="Cancel"
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleCancel}
            />
          </div>
        </div>
      )}

      {editingIndex !== -1 && (
        <div className={styles.addRow}>
          <NysButton
            label={addLabel}
            variant="outline"
            size="sm"
            type="button"
            onClick={handleOpenAdd}
          />
        </div>
      )}
    </div>
  );
}
