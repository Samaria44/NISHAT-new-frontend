import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 import
import "./Carousel.css";
import image1 from "../images/image1.webp";
import image2 from "../images/image2.webp";
import image3 from "../images/image3.webp";
import image4 from "../images/image4.webp";

export default function Carousel() {
  const navigate = useNavigate();

  const slides = [
    { img: image1, path: "/category/women" },     // 👈 change these paths as you like
    { img: image2, path: "/category/men" },
    { img: image3, path: "/category/luxury" },
    { img: image4, path: "/category/home" },
  ];

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
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSlideClick = (path) => {
    if (path) {
      navigate(path); // 👈 go to that category
    }
  };

  return (
    <div className="carousel-containerr">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentSlide ? "active" : ""}`}
          onClick={() => handleSlideClick(slide.path)} // 👈 clickable slide
          style={{ cursor: "pointer" }}
        >
          <img src={slide.img} alt={`Slide ${index + 1}`} />
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
