export function FloatingParticles() {
  return (
    <>
      <div className="particle w-4 h-4 absolute top-10 left-10 animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="particle w-6 h-6 absolute top-1/4 right-20 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="particle w-3 h-3 absolute top-1/2 left-1/4 animate-float" style={{ animationDelay: '4s' }}></div>
      <div className="particle w-5 h-5 absolute bottom-20 right-10 animate-float" style={{ animationDelay: '6s' }}></div>
      <div className="particle w-2 h-2 absolute bottom-1/4 left-1/3 animate-float" style={{ animationDelay: '1s' }}></div>
    </>
  );
}