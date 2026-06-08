import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarouselContext } from "../../Admin/context/CarouselContext";
import { API_BASE_URL } from "../../config/api";
import "./Carousel.css";
import image1 from "../images/image1.webp";
import image2 from "../images/image2.webp";
import image3 from "../images/image3.webp";
import image4 from "../images/image4.webp";

const BACKEND = API_BASE_URL.replace(/\/+$/, "");

export default function Carousel() {
  const navigate = useNavigate();
  const { carouselImages, loading, getActiveCarouselImages } = useContext(CarouselContext);

  const staticSlides = [
    { img: image1, path: "/category/women",  title: "Women Collection" },
    { img: image2, path: "/category/men",    title: "Men Collection"   },
    { img: image3, path: "/category/luxury", title: "Luxury"           },
    { img: image4, path: "/category/home",   title: "Home"             },
  ];

  const dynamicSlides = (Array.isArray(carouselImages) ? carouselImages : []).map((c) => ({
    img: c.image ? `${BACKEND}/${c.image.replace(/^\/+/, "")}` : image1,
    path: c.path,
    title: c.title,
  }));

  const slides = dynamicSlides.length > 0 ? dynamicSlides : staticSlides;

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1)), [slides.length]);

  // Auto-advance every 5 s
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  useEffect(() => {
    getActiveCarouselImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSlideClick = (path) => {
    if (path && path !== "/") navigate(path);
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
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`slide ${i === current ? "active" : ""}`}
          onClick={() => handleSlideClick(slide.path)}
          style={{ cursor: slide.path && slide.path !== "/" ? "pointer" : "default" }}
        >
          <img src={slide.img} alt={slide.title || `Slide ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
        </div>
      ))}

      <button className="arrow left" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous slide">&#10094;</button>
      <button className="arrow right" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next slide">&#10095;</button>

      {/* Dot indicators */}
      <div className="carousel-dots" role="tablist">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
            role="tab"
            aria-selected={i === current}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
