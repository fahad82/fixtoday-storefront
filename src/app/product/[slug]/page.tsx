// src/app/product/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import ProductWrapper from './ProductWrapper';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const product = await productService.getProductBySlug(slug);

    if (!product) {
      return {
        title: 'Product Not Found',
      };
    }

    return {
      title: `${product.name} | FixToday Store`,
      description: product.short_description || product.description || undefined,
      openGraph: {
        title: product.name,
        description: product.short_description || '',
        images: product.main_image ? [{ url: product.main_image }] : [],
      },
    };
  } catch (error) {
    console.error('❌ generateMetadata error:', error);
    return {
      title: 'Product Not Found',
    };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const product = await productService.getProductBySlug(slug);

    if (!product) {
      notFound();
    }

    // Fetch related products (same category)
    let relatedProducts: Product[] = []; // ← Add explicit type here
    try {
      const response = await productService.getProducts({
        category_id: product.category_id || undefined,
        limit: 4,
        status: 'active'
      });
      relatedProducts = response.products.filter(p => p.id !== product.id);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: product.main_image ? [product.main_image] : [],
      description: product.short_description || product.description,
      sku: product.sku || product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand_name || 'FixToday',
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.sale_price || product.base_price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.status === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductWrapper product={product} relatedProducts={relatedProducts} />
      </>
    );
  } catch (error) {
    console.error('❌ ProductPage error:', error);
    notFound();
  }
}