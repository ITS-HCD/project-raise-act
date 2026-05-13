import React from 'react';
import { NysButton } from './wrappers/NysButton';
import { NysDivider } from './wrappers/NysDivider';
import styles from './ReviewSection.module.css';

interface ReviewSectionProps {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}

export function ReviewSection({ title, onEdit, children }: ReviewSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <NysButton variant="text" label="Edit Section" size="sm" onClick={onEdit} />
      </div>
      {children}
      <NysDivider />
    </div>
  );
}
