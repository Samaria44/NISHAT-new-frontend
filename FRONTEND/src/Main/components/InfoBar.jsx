import React, { useState, useEffect, useRef } from "react";
import { LuShipWheel } from "react-icons/lu";
import { FaMapLocation } from "react-icons/fa6";
import { TiSupport } from "react-icons/ti";
import { MdOutlinePayments } from "react-icons/md";
import "./InfoBar.css";

export default function InfoBar() {
  const infoItems = [
    {
      icon: <LuShipWheel />,
      title: "Track Your Order",
      text: "Click here for quick update",
    },
    {
      icon: <FaMapLocation />,
      title: "Store Locator",
      text: "Click here to find your nearby store",
    },
    {
      icon: <TiSupport />,
      title: "SUPPORT 24/7",
      text: "Contact us 24 hours a day, 7 days a week",
    },
    {
      icon: <MdOutlinePayments />,
      title: "Payment Methods",
      text: "COD, Credit Card: Visa, Master Card",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto slide every 3 sec (mobile only)
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.innerWidth <= 768) {
        setCurrentIndex((prev) => (prev + 1) % infoItems.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [infoItems.length]);

  // Touch events for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // swipe left → next
        setCurrentIndex((prev) => (prev + 1) % infoItems.length);
      } else {
        // swipe right → prev
        setCurrentIndex((prev) =>
          prev === 0 ? infoItems.length - 1 : prev - 1
        );
      }
    }
  };

  return (
    <div className="info-bar-wrapper">
      <div
        className="info-bar"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {infoItems.map((item, index) => (
          <div
            key={index}
            className={`info-item ${
              window.innerWidth <= 768
                ? index === currentIndex
                  ? "active"
                  : "hidden"
                : ""
            }`}
          >
            <div className="info-icon">{item.icon}</div>
            <div className="info-text">
              <h4>{item.title}</h4>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots for mobile */}
      {window.innerWidth <= 768 && (
        <div className="dots">
          {infoItems.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}
