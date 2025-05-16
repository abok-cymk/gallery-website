import { memo,} from "react";

interface Image {
  id: string;
  url: string;
  title: string;
  description: string;
}

interface ImageCardProps {
  image: Image;
  index: number;
}

const ImageCard = ({ image, index }: ImageCardProps) => {
  // const [isVisible, setIsVisible] = useState(false);

  // // Animation delay for fade in effect
  // useEffect(() => {
  //     const timer = setTimeout(() => {
  //         setIsVisible(true);
  //     }, index * 100); // Staggered delay based on index

  //     return () => clearTimeout(timer);
  // }, [index]);

  return (
    <div
      data-image-id={image.id}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-transform duration-500 animate-fadeIn"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <img
        src={image.url}
        alt={image.title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-lg/6 font-semibold">{image.title}</h3>
        <p className="text-sm/6 text-gray-600">{image.description}</p>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(ImageCard);
