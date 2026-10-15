import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/domains/products/types/product.types';
import { formatPrice } from '@/shared/utils/formatPrice';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    // 배열 순서가 달라져도 대표 이미지(product_main)만 썸네일로 사용합니다.
    // 대표 이미지가 없거나 URL이 없으면 아래의 '이미지 준비 중' 상태를 표시합니다.
    const imageUrl = product.images.find(
        (image) => image.location === 'product_main' && image.url,
    )?.url;
    const isDiscounted = product.salePrice < product.listPrice;

    return (
        <Link
            href={`/products/${product.id}`}
            prefetch={false}
            className="group block rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-4"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1439px) 25vw, 320px"
                        className="object-contain transition-transform duration-300 motion-safe:group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                        이미지 준비 중
                    </div>
                )}
                {product.new && (
                    <span className="absolute top-3 left-3 bg-white px-2 py-1 text-[10px] font-semibold tracking-wider">
                        NEW
                    </span>
                )}
            </div>
            <div className="mt-4 space-y-2">
                <p className="text-[11px] tracking-wider text-neutral-500">
                    {product.categoryName}
                </p>
                <h2 className="text-sm font-medium break-keep group-hover:underline">
                    {product.name}
                </h2>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                    <span className="font-semibold">
                        <span className="sr-only">판매가 </span>
                        {formatPrice(product.salePrice)}
                    </span>
                    {isDiscounted && (
                        <span className="text-xs text-neutral-400 line-through">
                            <span className="sr-only">정가 </span>
                            {formatPrice(product.listPrice)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
