export function SkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border p-3 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-4/5 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                </div>
            ))}
        </div>
    )
}

export function SkeletonHero() {
    return <div className="h-80 bg-gray-200 animate-pulse rounded-xl" />
}


