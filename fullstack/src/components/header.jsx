import { useState } from "react";
import "./header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="title">
        <a href="/">
          <h1>Otago Polytechnic Weather Station</h1>
        </a>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>

      <div className={`links ${menuOpen ? "show" : ""}`}>
        <ul>
          <li><a href="/about">ABOUT</a></li>
          <li><a href="https://www.op.ac.nz/">OTAGO POLYTECHNIC</a></li>
        </ul>
      </div>
    </nav>
  );
}
