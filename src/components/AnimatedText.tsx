export default function AnimatedText({ text }: { text: string }) {
  // Split by words to ensure proper word-level wrapping (never breaks in the middle of a word)
  const words = text.split(' ');
  let charCounter = 0;

  return (
    <span className="relative inline-flex flex-wrap justify-center items-center text-center overflow-hidden max-w-full">
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((char) => {
            const charIdx = charCounter++;
            return (
              <span key={charIdx} className="relative inline-block">
                <span 
                  className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-[120%]" 
                  style={{ transitionDelay: `${charIdx * 0.015}s` }}
                >
                  {char}
                </span>
                <span 
                  className="absolute left-0 -top-full inline-block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-full" 
                  style={{ transitionDelay: `${charIdx * 0.015}s` }}
                >
                  {char}
                </span>
              </span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
}
