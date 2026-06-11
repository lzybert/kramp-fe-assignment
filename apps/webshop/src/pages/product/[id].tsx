import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../_app';
import styles from './[id].module.css';
import { CartCtx, Product } from '../../types';
import { fetchGraphQL } from '../../utils/fetchGraphQL';

var GRAPHQL_URL = 'http://localhost:4000/graphql';

export default function ProductPage() {
  const router = useRouter();
  const { cart } = useContext(CartContext) as CartCtx;
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    if (!router.query.id) return;

    const gqlQuery = `
          query GetProduct($id: ID!) {
            product(id: $id) {
              id
              name
              description
              price
              category
              imageUrl
              stock
              createdAt
            }
          }
        `;
    fetchGraphQL<{ product: Product }>(gqlQuery, { id: router.query.id })
      .then(data => {
        console.log('product loaded:', data);
        setProduct(data.product);
      })
      .catch(error => {
        // here should go error handling
        console.log(error);
      });
  }, [router.query.id]);

  const handleAddToCart = () => {
    if (!product) return;

    const currentItems = [...(cart.cart || []), {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    }];
    let runningTotal = 0;
    for (let i = 0; i < currentItems.length; i++) {
      runningTotal += currentItems[i].price * currentItems[i].quantity;
    }
    console.log('cart total after add:', runningTotal);

    cart.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  if (!product) {
    return (
      <div className={styles.page}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.imageWrapper}>
          <img
            src={product!.imageUrl}
            alt=""
            className={styles.image}
          />
        </div>
        <div className={styles.details}>
          <p className={styles.category}>{product!.category}</p>
          <h1 className={styles.name}>{product!.name}</h1>
          <p className={styles.price}>€{product!.price.toFixed(2)}</p>
          <p className={styles.description}>{product!.description}</p>
          <p className={styles.meta}>
            Listed: {new Date(product!.createdAt).toLocaleDateString()}
            {' · '}
            {product!.stock} in stock
          </p>
          <div className={styles.addToCart} onClick={handleAddToCart}>
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
}
