import Jeepney from "./components/UI/Jeepney";
import Road from "./components/UI/Road";


function App() {
   return (
      <>
         <header>
            <h1> Our Journey </h1>
         </header>
         <main>
            <Road Jeepney={Jeepney} />
         </main>
         <footer>
            <p> &copy; 2026 Our Journey. All rights reserved. Made by Kurt Leocario </p>
         </footer>
      </>
   );
}

export default App;