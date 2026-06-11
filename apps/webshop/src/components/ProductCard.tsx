import React from 'react';
import { useRouter } from 'next/router';
import styles from './ProductCard.module.css';
import { Product } from '../types';

type ProductCardType = {
  product: Product;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardType> = ({ product, onAddToCart = () => {}  }) => {
  const router = useRouter();

  return (
    <div
      className={styles.card}
      data-testid="product-card"
    >
      <img
        src={product.imageUrl}
        alt=""
        width="300"
        height="200"
        className={styles.image}
      />
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.price} data-testid="product-price">€{product.price.toFixed(2)}</p>
        <button
          onClick={() => router.push(`/product/${product.id}`)}
          className={styles.button}
        >
          View product
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
