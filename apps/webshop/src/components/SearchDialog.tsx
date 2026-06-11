import styles from './SearchDialog.module.css';
import { Product } from '../types';

interface SearchDialogProps {
  results: Product[];
  onSelect: (id: string) => void;
}

export function SearchDialog({ results, onSelect }: SearchDialogProps) {
  if (!results.length) return null;

  return (
    <div className={styles.dialog}>
      {results.map((result, index) => (
        <div
          key={result.id}
          className={styles.item}
          onClick={() => onSelect(result.id)}
          role="button"
        >
          <span className={styles.itemName}>{result.name}</span>
          <span className={styles.itemPrice}>€{result.price.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
