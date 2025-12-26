// src/Main/components/CategoryCarousel.jsx
import { useEffect, useState, useRef, useContext } from "react";
import { SpecialSaleContext } from "../../Admin/context/SpecialSaleContext";
import "./Categorycarousel.css";

export default function CategoryCarousel() {
  const trackRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const { specialSales, loading, bannerText } = useContext(SpecialSaleContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(6);

  // --- Responsive ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) setCardsToShow(2);
      else if (window.innerWidth <= 768) setCardsToShow(3);
      else setCardsToShow(6);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Auto scroll ---
  useEffect(() => {
    if (!specialSales || specialSales.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, [specialSales]);

  // --- Transform carousel ---
  useEffect(() => {
    if (!trackRef.current || !specialSales || specialSales.length === 0) return;

    const track = trackRef.current;
    const cardWidth = track.offsetWidth / cardsToShow;
    const len = specialSales.length;

    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Seamless reset
    if (currentIndex >= len) {
      setTimeout(() => {
        track.style.transition = "none";
        setCurrentIndex(0);
        track.style.transform = `translateX(0px)`;
      }, 500);
    } else if (currentIndex < 0) {
      setTimeout(() => {
        track.style.transition = "none";
        setCurrentIndex(len - 1);
        track.style.transform = `translateX(-${(len - 1) * cardWidth}px)`;
      }, 500);
    }
  }, [currentIndex, cardsToShow, specialSales]);

  // --- Swipe support ---
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current || !specialSales || specialSales.length === 0)
      return;
    const diff = e.changedTouches[0].clientX - startX.current;
    isDragging.current = false;

    if (diff > 50) setCurrentIndex((prev) => prev - 1);
    else if (diff < -50) setCurrentIndex((prev) => prev + 1);
  };

  // --- Render ---
  if (loading || !specialSales) return <div>Loading...</div>;
  if (specialSales.length === 0) return <div>No special sales available</div>;

  // Duplicate for seamless loop
  const loopedItems = [...specialSales, ...specialSales];

  return (
    <div className="big-container">
      {/* single banner text for all products */}
      <div className="left-text">
        <h2>{bannerText || "SPECIAL SALE"}</h2>
      </div>

      <div
        className="carousel-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-track" ref={trackRef}>
          {loopedItems.map((item, i) => (
            <div
              key={item._id + "-" + i}
              className="circle-card"
              onClick={() =>
                item.navigateTo && (window.location.href = item.navigateTo)
              }
            >
              <div className="circle-image">
                <img
                  src={
                    item.image
                      ? `
http://localhost:8000

${item.image}`
                      : "https://placeholder.co/200x200?text=No+Image"
                  }
                  alt={item.name}
                />
                {item.discount > 0 && (
                  <div className="sale-discount-badge">
                    {item.discount}% OFF
                  </div>
                )}
              </div>
              <p className="circle-name">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
