// src/components/ImageGrid.tsx (Updated with TanStack Query)
import { useEffect, useRef, useCallback, Suspense, lazy } from "react";
import { VariableSizeList as List } from "react-window";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { debounce } from "lodash";

const ImageCard = lazy(() => import("./ImageCard"));

interface Image {
  id: string;
  url: string;
  title: string;
  description: string;
}

interface ImageGridProps {
  searchQuery: string;
}

const ITEMS_PER_PAGE = 8;

const ImageGrid = ({ searchQuery }: ImageGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);

  // Fetch images using TanStack Query
  const { data, fetchNextPage, hasNextPage, isFetching, isError, error } =
    useInfiniteQuery({
      queryKey: ["images", searchQuery],
      queryFn: async ({ pageParam = 1 }) => {
        const response = await axios.get("http://localhost:3001/api/images", {
          params: {
            query: searchQuery || "nature",
            page: pageParam,
            per_page: ITEMS_PER_PAGE,
          },
        });
        return response.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < ITEMS_PER_PAGE) return undefined;
        return allPages.length + 1;
      },
      initialPageParam: 1,
    });

  // Flatten the paginated data
  const images = data?.pages.flat() ?? [];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!gridRef.current || isFetching || !hasNextPage) return;

    const debouncedFetchNextPage = debounce(() => {
      fetchNextPage();
    }, 200);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          debouncedFetchNextPage();
        }
      },
      { threshold: 0.5, rootMargin: "200px" }
    );

    const sentinel = gridRef.current.lastElementChild;
    if (sentinel) observer.observe(sentinel);

    return () => {
      observer.disconnect();
      debouncedFetchNextPage.cancel();
    };
  }, [isFetching, hasNextPage, fetchNextPage]);

  // Pagination controls
  const handlePrevious = useCallback(() => {
    const currentPage = data?.pages.length ?? 1;
    if (currentPage <= 1) return;
    // TanStack Query doesn't support "previous page" natively with infinite queries,
    // so we can reset and refetch from a specific page if needed.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [data]);

  const handleNext = useCallback(() => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  // Event delegation for image clicks
  const handleGridClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const imageCard = target.closest("[data-image-id]");
    if (imageCard) {
      const imageId = imageCard.getAttribute("data-image-id");
      console.log(`Clicked image ${imageId}`);
    }
  }, []);

  // Dynamic height calculation
  const getItemSize = (index: number) => {
    const image = images[index];
    if (!image) return 300;
    const baseHeight = 48 * 4;
    const textHeight = image.description.length > 50 ? 100 : 80;
    return baseHeight + textHeight + 32;
  };

  // Virtualized list rendering
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const image = images[index];
    if (!image) return null;
    return (
      <div style={style}>
        <Suspense fallback={<ImagePlaceholder />}>
          <ImageCard image={image} index={index} />
        </Suspense>
      </div>
    );
  };

  return (
    <div>
      <div ref={gridRef} onClick={handleGridClick}>
        <List
          ref={listRef}
          height={600}
          itemCount={images.length}
          itemSize={getItemSize}
          width="100%"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {Row}
        </List>
        <div className="sentinel h-1"></div>
      </div>
      {isFetching && (
        <div className="text-center my-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {isError && (
        <div className="text-center my-4 text-red-500">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to load images"}
        </div>
      )}
      {images.length === 0 && !isFetching && !isError && (
        <div className="text-center my-4">No images found</div>
      )}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={(data?.pages.length ?? 1) === 1 || isFetching}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="self-center">Page {data?.pages.length ?? 1}</span>
        <button
          onClick={handleNext}
          disabled={!hasNextPage || isFetching}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const ImagePlaceholder = () => (
  <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg"></div>
);

export default ImageGrid;
