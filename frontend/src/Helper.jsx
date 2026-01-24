function Loading() {
  return (
    <div className="box h-screen w-full flex scrollbar-hidden justify-center items-center font-[Orbitron] font-bold text-xl text-[#fcf53a] [text-shadow:_0_0_12px_#FFCC00]">
      Loading...
    </div>
  );
}

function RateLimiting() {
    return ( 
        <div className="box h-screen w-full flex scrollbar-hidden justify-center items-center font-[Orbitron] text-xl text-rose-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
        Too many requests — please try again later
      </div>
     );
}


export {Loading,RateLimiting};