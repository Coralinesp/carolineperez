import { Routes, Route } from "react-router-dom";
import App from "./App";
import About from "./app/about/page";
import Blue from "./app/cases/blue/page";
import Blueweb from "./app/cases/blueweb/page";
import Ben from "./app/cases/ben/page";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
      <Route path="/cases/blue" element={<Blue />} />
      <Route path="/cases/blueweb" element={<Blueweb />} />
      <Route path="/cases/ben" element={<Ben />} />
    </Routes>
  );
}
