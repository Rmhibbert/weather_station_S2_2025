import Image from 'next/image';
export default function Footer() {
  return (    
    <footer className="page-footer p-6 text-center text-sm w-full">
      <div className="w-4/5 h-px bg-white mx-auto"></div>

      <div className="text-center mt-2">
      <p className="mt-2 mb-1 leading-relaxed">
        Weather station is located on the roof of Otago Polytechnic D-Block, 60
        Harbour Terrace
      </p>     
      
      </div>      
      <div className="flex justify-between items-center mt-4 w-full px-8">        
      <a
          href="https://www.op.ac.nz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/OP-logo.png"
            alt="Otago Polytechnic Logo"            
            width={60}
            height={60}
          />
        </a>
        
      <p className="m-0 font-light">
        Developed by Hayden, Rory, Sophie, Tylor, Denise and Bradley
      </p>
        <a
          href="https://github.com/Rmhibbert/weather_station_S2_2025"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/images/github-mark-white.png"
            alt="GitHub Logo"            
            width={30}
            height={30}
          />
        </a>
      </div> 
    </footer>
  );
}