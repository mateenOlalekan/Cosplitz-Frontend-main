 import Navbar from "../components/Layout/Navbar";
 import Footer from '../components/Layout/Footer';
 import Hero  from  "../components/Other/Hero";
 import Why from '../components/Other/Why';
 import Who from '../components/Other/Who';
 import Work from "../components/Other/Work";

 export default function Home() {
   return (
     <>
      <Navbar />
        <main className="flex flex-col scroll-smooth">
            <Hero />
            <Work />
            <Why />
            <Who />
        </main>
      <Footer />
     </>
   )
 }

