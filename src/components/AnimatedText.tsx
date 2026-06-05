export default function AnimatedText({ text }: { text: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      {text.split('').map((char, i) => (
        <span key={i} className="relative inline-block">
          <span 
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-[120%]" 
            style={{ transitionDelay: `${i * 0.015}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
          <span 
            className="absolute left-0 -top-full inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-full" 
            style={{ transitionDelay: `${i * 0.015}s` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  );
}
