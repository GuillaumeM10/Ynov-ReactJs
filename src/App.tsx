import "./App.scss";
import Layout from "./components/Layout";
import Router from "./components/Router";
import { BrowserRouter } from "react-router-dom";
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import "./Style/main.scss";

function App() {
  return (
    <>
      <BrowserRouter>
        <Layout>
          <Router />
        </Layout>
      </BrowserRouter>
    </>
  );
}

export default App;
