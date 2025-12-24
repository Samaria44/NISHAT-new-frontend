import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopByCategory.css";
import { CategoryContext } from "../../Admin/context/CategoryContext";

// Fallback static categories if backend categories are not available
const staticCategories = [
  { name: "UNSTITCH", image: "", size: "large" },
  { name: "LUXURY", image: "", size: "medium" },
  { name: "READY TO STITCH", image: "", size: "medium" },
  { name: "PRET", image: "", size: "large" },
  { name: "MEN", image: "", size: "medium" },
  { name: "FREEDOM TO BUY", image: "", size: "medium" },
  { name: "FOOTWEAR", image: "", size: "medium" },
  { name: "BAGS", image: "", size: "medium" },
  { name: "WRAPS", image: "", size: "medium" },
  { name: "JALABIYAS", image: "", size: "medium" },
];

export default function ShopByCategory() {
  const navigate = useNavigate();
  const { categories } = useContext(CategoryContext); // backend categories

  const handleCategoryClick = (categoryName) => {
    // normalise for compare
    const nameLower = categoryName.toLowerCase().trim();

    // 1️⃣ Check: kya ye category ka name hai?
    const matchedCategory = categories.find(
      (cat) => cat.name.toLowerCase().trim() === nameLower
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
          (s) => s.name.toLowerCase().trim() === nameLower
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

    // 3️⃣ Default: just go to category page with category name
    navigate(`/category/${categoryName}`);
  };

  // Use backend categories if available, otherwise fallback to static
  const displayCategories = categories && categories.length > 0 ? categories : staticCategories;

  const gridPattern = ['large', 'medium', 'medium', 'large', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium'];

  return (
    <section className="shop-by-category">
      <h2>Shop by Category</h2>
      <div className="categories-grid">
        {displayCategories.map((cat, index) => {
          // Assign size based on grid pattern, cycle if more categories
          const size = gridPattern[index % gridPattern.length];
          
          return (
            <div
              key={cat._id || index}
              className={`category-item ${size}`}
              onClick={() => handleCategoryClick(cat.name)}
              style={{ cursor: "pointer" }}
            >
              <img 
                src={
                  cat.image
                    ? `https://nishat-api.vercel.app${cat.image}`
                    : "https://placeholder.co/300x300?text=No+Image"
                }
                alt={cat.name} 
              />
              <div className="category-name">{cat.name}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
