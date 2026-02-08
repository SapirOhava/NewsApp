import Link from 'next/link';

type Newsflash = {
  id: string;
  message: string;
  linkUrl?: string | null;
  priority: number;
};

type NewsflashBannerProps = {
  newsflashes: Newsflash[];
};

export function NewsflashBanner({ newsflashes }: NewsflashBannerProps) {
  // Filter only published newsflashes and sort by priority
  const activeNewsflashes = newsflashes
    .filter((nf) => nf.message) // Only show ones with messages
    .sort((a, b) => b.priority - a.priority); // Higher priority first

  if (activeNewsflashes.length === 0) {
    return null; // Don't show banner if no newsflashes
  }

  return (
    <div className="bg-blue-600 text-white py-2 overflow-hidden relative">
      <div className="flex animate-scroll">
        {/* Duplicate content for seamless loop */}
        {[...activeNewsflashes, ...activeNewsflashes].map((newsflash, index) => (
          <div key={`${newsflash.id}-${index}`} className="flex-shrink-0 px-8 whitespace-nowrap">
            {newsflash.linkUrl ? (
              <Link 
                href={newsflash.linkUrl} 
                className="hover:underline"
              >
                {newsflash.message}
              </Link>
            ) : (
              <span>{newsflash.message}</span>
            )}
            {index < activeNewsflashes.length - 1 && (
              <span className="mx-8">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}