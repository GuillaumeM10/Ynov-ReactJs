import "./App.scss";
import Layout from "./components/Layout";
import Router from "./components/Router";
import { BrowserRouter } from "react-router-dom";

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
