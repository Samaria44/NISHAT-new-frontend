import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarouselContext } from "../../Admin/context/CarouselContext";
import "./Carousel.css";
import image1 from "../images/image1.webp";
import image2 from "../images/image2.webp";
import image3 from "../images/image3.webp";
import image4 from "../images/image4.webp";

export default function Carousel() {
  const navigate = useNavigate();
  const { carouselImages, loading, getActiveCarouselImages } = useContext(CarouselContext);

  // Fallback to static images if no dynamic images
  const staticSlides = [
    { img: image1, path: "/category/women" },
    { img: image2, path: "/category/men" },
    { img: image3, path: "/category/luxury" },
    { img: image4, path: "/category/home" },
  ];

  // Convert backend carousel images to slide format
  const dynamicSlides = carouselImages.map((carousel) => ({
    img: carousel.image ? `http://localhost:8000/${carousel.image}` : image1,
    path: carousel.path,
    title: carousel.title,
  }));

  // Use dynamic slides if available, otherwise use static
  const slides = dynamicSlides.length > 0 ? dynamicSlides : staticSlides;

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    // Load active carousel images on mount
    getActiveCarouselImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSlideClick = (path) => {
    if (path && path !== "/") {
      navigate(path);
    }
  };

  if (loading) {
    return (
      <div className="carousel-containerr">
        <div className="slide active">
          <img src={image1} alt="Loading..." />
        </div>
      </div>
    );
  }

  return (
    <div className="carousel-containerr">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          onClick={() => handleSlideClick(slide.path)}
          style={{ cursor: "pointer" }}
        >
          <img src={slide.img} alt={slide.title || `Slide ${index + 1}`} />
        </div>
      ))}

      {/* Arrows */}
      <button className="arrow left" onClick={prevSlide}>
        ❮
      </button>
      <button className="arrow right" onClick={nextSlide}>
        ❯
      </button>
    </div>
  );
}
