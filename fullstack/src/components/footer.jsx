import Image from 'next/image';
export default function Footer() {
  return (
    <footer className="page-footer p-6 text-center text-sm flex flex-col items-center w-full">
      <div className="w-4/5 h-px bg-white"></div>
      <p className="mt-2 mb-1 leading-relaxed">
        Weather station is located on the roof of Otago Polytechnic D-Block, 60
        Harbour Terrace
      </p>
      <p className="m-0 font-light">
        {/* Developed by Samantha, Kieren, Jackson, Tom, and Ben */}
        Developed by Hayden, Rory, Sophie, Tylor, Denise and Bradley
      </p>
      <p className="m-0 font-light">Check out our GitHub page:</p>
      <div className="mt-2">
        <a
          href="https://github.com/Rmhibbert/weather_station_S2_2025"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/github-mark-white.png"
            alt="GitHub Logo"
            className="w-6 h-6 inline-block align-middle"
            width={24}
            height={24}
          />
        </a>
      </div>
    </footer>
  );
}
