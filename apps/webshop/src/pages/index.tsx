import { GetServerSideProps } from 'next';
import ProductCard from '../components/ProductCard';
import styles from './index.module.css';
import { Product } from '../types';
import { fetchGraphQL } from '../utils/fetchGraphQL';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async () => {
  const FEATURED_IDS = ['1', '4', '11', '17'];
  let featured: Product[] = [];
  const gqlQuery = `
            query GetProduct($ids: [ID!]!) {
              products(ids: $ids) {
                id
                name
                price
                imageUrl
                description
                category
                stock
                createdAt
              }
            }
        `;
  try {
    const data = await fetchGraphQL<{ products: Product[] }>(gqlQuery, { ids: FEATURED_IDS }, { next: { revalidate: 300 } });
    console.log(data);
    if (data.products) {
      featured = data.products;
    }
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      featured,
      timestamp: Date.now(),
    },
  };
};

interface HomePageProps {
  featured: Product[];
  timestamp: number;
}

export default function HomePage({ featured, timestamp }: HomePageProps) {
  return (
    <div>
      <section className={styles.hero}>
        <img
          src="https://placehold.co/1200x800/e63329/ffffff?text=Kramp+Webshop"
          alt="Kramp — Your industrial supply partner"
          loading="lazy"
          className={styles.heroImage}
        />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Industrial supplies, delivered.</h1>
          <p className={styles.heroSubtitle}>
            Tools, fasteners, safety equipment and power tools for professionals.
          </p>
        </div>
      </section>

      <section className={styles.featured}>
        <div className={styles.featuredHeader}>
          <h2>Featured products</h2>
          <p className={styles.timestamp}>
            Last updated: {new Date(timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className={styles.grid}>
          {featured.map((product, index) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className={styles.categories}>
        <h2>Shop by category</h2>
        <div className={styles.categoryGrid}>
          {['Tools', 'Fasteners', 'Safety Equipment', 'Power Tools'].map((cat, index) => (
            <Link key={index} href={`/search#${cat}`} className={styles.categoryCard}>
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
