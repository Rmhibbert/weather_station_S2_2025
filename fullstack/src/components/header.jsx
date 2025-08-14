import './header.css';

export default function Header() {
  return (
    <section className="header">
      <nav>
        <a href="home">
          <img src="/images/logo1.png" alt="Logo" />
        </a>
        <div className="textbox">
          <h1>Otago Polytechnic Weather Station</h1>
        </div>
        <div className="links">
          <ul>
            <li>
              <a href="about">ABOUT</a>
            </li>
            <li>
              <a href="courses">OTAGO POLYTECHNIC</a>
            </li>
          </ul>
        </div>
      </nav>
    </section>
  );
}
