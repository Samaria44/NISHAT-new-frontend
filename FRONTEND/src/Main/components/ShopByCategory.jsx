import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopByCategory.css";
import category1 from "../images/category1.webp";
import category2 from "../images/category2.webp";
import category3 from "../images/category3.webp";
import category4 from "../images/category4.webp";
import img5 from "../images/img5.webp";
import category6 from "../images/category6.webp";
import category7 from "../images/category7.webp";
import category8 from "../images/category8.webp";
import category9 from "../images/category9.webp";
import category10 from "../images/category10.webp";
import { CategoryContext } from "../../Admin/context/CategoryContext";

const staticCategories = [
  { name: "UNSTITCH", img: category1, size: "large" },
  { name: "LUXURY", img: category2, size: "medium" },
  { name: "READY TO STITCH", img: category3, size: "medium" },
  { name: "PRET", img: category4, size: "large" },
  { name: "MEN", img: img5, size: "medium" },
  { name: "FREEDOM TO BUY", img: category6, size: "medium" },
  { name: "FOOTWEAR", img: category7, size: "medium" },
  { name: "BAGS", img: category8, size: "medium" },
  { name: "WRAPS", img: category9, size: "medium" },
  { name: "JALABIYAS", img: category10, size: "medium" },
];

export default function ShopByCategory() {
  const navigate = useNavigate();
  const { categories } = useContext(CategoryContext); // backend categories

  const handleCategoryClick = (tileName) => {
    // normalise for compare
    const tileLower = tileName.toLowerCase().trim();

    // 1️⃣ Check: kya ye category ka name hai?
    const matchedCategory = categories.find(
      (cat) => cat.name.toLowerCase().trim() === tileLower
    );

    if (matchedCategory) {
      // example: /category/Women
      navigate(`/category/${matchedCategory.name}`);
      return;
    }

    // 2️⃣ Check: kya ye kisi category ki subcategory hai?
    let foundParent = null;
    let foundSub = null;

    for (const cat of categories) {
      if (Array.isArray(cat.subcategories)) {
        const sub = cat.subcategories.find(
          (s) => s.name.toLowerCase().trim() === tileLower
        );
        if (sub) {
          foundParent = cat;
          foundSub = sub;
          break;
        }
      }
    }

    if (foundParent && foundSub) {
      // example: /category/Women/Unstitch
      navigate(`/category/${foundParent.name}/${foundSub.name}`);
      return;
    }

    // 3️⃣ Fallback: agar kahin match na mile, to simple generic route
    navigate(`/category/${tileName}`);
  };

  return (
    <section className="shop-by-category">
      <h2>Shop by Category</h2>
      <div className="categories-grid">
        {staticCategories.map((cat, index) => (
          <div
            key={index}
            className={`category-item ${cat.size}`}
            onClick={() => handleCategoryClick(cat.name)}
            style={{ cursor: "pointer" }}
          >
            <img src={cat.img} alt={cat.name} />
            <div className="category-name">{cat.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
