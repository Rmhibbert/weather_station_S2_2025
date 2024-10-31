export default function Footer() {
  return (
    <footer
      className="page-footer"
      style={{
        padding: "1.5rem 2rem",
        textAlign: "center",
        fontSize: "0.85rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: '100%'
      }}
    >
      <div
        style={{
          width: "80%",
          height: "1px",
          backgroundColor: "rgba(240, 240, 240, 0.7)",
        }}
      ></div>
      <p style={{ margin: "0.5rem 0", lineHeight: 1.5 }}>
        Weather station is located on the roof of Otago Polytechnic D-Block, 60
        Harbour Terrace
      </p>
      <p style={{ margin: 0, fontWeight: "lighter" }}>
        Developed by Samantha, Kieren, Jackson, Tom and Ben
      </p>
      <p style={{ margin: 0, fontWeight: "lighter" }}>
        Check out our Github page:
      </p>
      <div style={{ marginTop: "0.5rem" }}>
        <a
          href="https://github.com/OtagoPolytechnic/Cloudy-with-a-Chance-of-LoRa"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/github-mark-white.png"
            alt="GitHub Logo"
            style={{
              width: "24px",
              height: "24px",
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
        </a>
      </div>
    </footer>
  );
}
