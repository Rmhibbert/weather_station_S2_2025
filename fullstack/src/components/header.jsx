import './header.css';
export default function Header() {
  return (
      <nav>
        <div className="textbox">
          <a href="/">
          <h1>Otago Polytechnic Weather Station</h1>
          </a>
        </div>
        <div className="links">
          <ul>
            <li>
              <a href="/about">ABOUT</a>
            </li>
            <li>
              <a href="https://www.op.ac.nz/">OTAGO POLYTECHNIC</a>
            </li>
          </ul>
        </div>
      </nav>
  );
}
