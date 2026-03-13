import "./hero.css";

const Hero = () => {

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", search);
    };

    return (
        <div className="hero">
            <div className="hero_content">
                <img src="/hero_img.png" alt="hero" className="hero_img" />
            </div>
        </div>
    );
}

export default Hero;