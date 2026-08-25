
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import './index.css';
import Router from "./Routes";
import ScrollToTop from './components/ScrollToTop';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SmoothScroll>
      <ScrollToTop />
      <CustomCursor />
      <Router />
    </SmoothScroll>
  </BrowserRouter>
);