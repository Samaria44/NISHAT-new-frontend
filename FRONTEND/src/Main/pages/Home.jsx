//C:\Users\samar\Desktop\GCS\NISHAT\FRONTEND\my-react-app\src\Main\pages\Home.jsx
import Carousel from "../components/Carousel";
import CategoryCarousel from "../components/CategoryCarousel";
import InfoBar from "../components/InfoBar";
import ShopByCategory from "../components/ShopByCategory";



export default function Home(){
    return(
        <div>
         
                <Carousel/>
                {/* <SpecialSale/> */}
                <CategoryCarousel/>
                <ShopByCategory/>
                <InfoBar/>
           
        </div>
    )
}