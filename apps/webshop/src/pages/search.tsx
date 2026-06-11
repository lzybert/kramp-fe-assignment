import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { groupBy } from '../utils/groupBy';
import ProductCard from '../components/ProductCard';
import styles from './search.module.css';
import { Product } from '../types';
import { fetchGraphQL } from '../utils/fetchGraphQL';

export default function SearchPage() {
  const router = useRouter();
  const [results, setResults] = useState<Product[]>([]);
  const [filteredResults, setFilteredResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = (router.query.q as string) || '';

    setIsLoading(true);
    const gqlQuery = `
          query SearchProducts($q: String!) {
            searchProducts(query: $q) {
              id
              name
              price
              imageUrl
              category
              description
              stock
              createdAt
            }
          }
        `;
    fetchGraphQL<{ searchProducts: Product[] }>(gqlQuery, { q })
      .then(data => {
        console.log('search results:', data);
        setResults(data.searchProducts);
        setIsLoading(false);
      })
      .catch(error => {
        // here should go error handling
        console.log(error);
      });
  }, [router.query.q]);

  useEffect(() => {
    setFilteredResults(results);
  }, [results]);

  const grouped = groupBy(filteredResults, 'category');

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.heading}>
          {router.query.q ? `Results for "${router.query.q}"` : 'All products'}
        </h1>

        {isLoading && <p>Loading...</p>}

        {!isLoading && !filteredResults.length && (
          <p className={styles.empty}>No products found.</p>
        )}

        {Object.keys(grouped).map(category => (
          <section key={category} className={styles.category} id={category}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.grid}>
              {grouped[category].map((product, index) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
