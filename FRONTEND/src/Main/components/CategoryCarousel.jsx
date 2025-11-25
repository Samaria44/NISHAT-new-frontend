//D:\samaria\NISHAT\FRONTEND\my-react-app\src\Main\components\CategoryCarousel.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Categorycarousel.css";
import img1 from "../images/img1.webp";
import img2 from "../images/img2.webp";
import img3 from "../images/img3.webp";
import img4 from "../images/img4.webp";
import img5 from "../images/img5.webp";
import img6 from "../images/img6.webp";
import img7 from "../images/img7.webp";

export default function CategoryCarousel() {
  const navigate = useNavigate();
  const trackRef = useRef(null);



const categories = [
  { img: img1, name: "BAGS" },
  { img: img2, name: "SHOES" },
  { img: img3, name: "WINTER SPOTLIGHT" },
  { img: img4, name: "AURA" },
  { img: img5, name: "MEN" },
  { img: img6, name: "Embroidered Pret" },
  { img: img7, name: "SEASON SHIFT" },
];






  // Duplicate categories for seamless infinite loop
  const loopedCategories = [...categories, ...categories];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(6); // Desktop default

  // Responsive: adjust cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setCardsToShow(3);
      else setCardsToShow(6);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Transform carousel and handle infinite loop
  useEffect(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const cardWidth = track.offsetWidth / cardsToShow;

    track.style.transition = "transform 0.8s ease";
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Reset to start seamlessly
    if (currentIndex >= categories.length) {
      setTimeout(() => {
        track.style.transition = "none";
        setCurrentIndex(0);
        track.style.transform = `translateX(0px)`;
      }, 800); // match transition duration
    }
  }, [currentIndex, cardsToShow, categories.length]);

  // Mobile swipe support
  const startX = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
  };

  const handleTouchEnd = (e) => {
    isDragging.current = false;
    const diff = e.changedTouches[0].clientX - startX.current;
    if (diff > 50) setCurrentIndex((prev) => prev - 1);
    if (diff < -50) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="big-container">
      {/* Left Text fixed on left */}
      <div className="left-text">
        <h2>WINTER</h2>
        <h1>2025</h1>
      </div>

      <div
        className="carousel-wrapper"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-track" ref={trackRef}>
  {loopedCategories.map((item, i) => (
  <div
  key={i}
  className="circle-card"
  onClick={() => navigate(`/category/${item.name}`)} >
    <div className="circle-image">
      <img src={item.img} alt={item.name} />
    </div>
    <p className="circle-name">{item.name}</p>
  </div>
))}

        </div>

        <div className="dots-container">
          {categories.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === currentIndex % categories.length ? "active-dot" : ""}`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
}
