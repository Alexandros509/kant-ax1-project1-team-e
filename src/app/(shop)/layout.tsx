import Header from '@/shared/components/Header';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="pb-8">
            {/* 하단 고정 헤더가 콘텐츠를 가리지 않도록 32px 여백을 둡니다. */}
            <Header />
            <main>{children}</main>
        </div>
    );
}
