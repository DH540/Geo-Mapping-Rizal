import './App.css';
import Header from './Home/header';
import Footer from './Home/footer';
import Hero from './Home/hero';
import Offers from './Home/offers';
import Promo from './Home/promo';

export default function App() {
    return (
        <div className="App">
            <Header />
            <main>
                <Hero />
                <Offers />
                <Promo />
            </main>
            <Footer />
        </div>
    );
}