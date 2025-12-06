 import Navbar from "../components/Layout/Navbar";
 import Footer from '../components/Layout/Footer';
 import Hero  from  "../components/Hero";
 import Why from '../components/Why';
 import Who from '../components/Who';
 import Work from "../components/Work";
 import Choose from "../components/Choose";

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

