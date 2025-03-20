
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away to set initial state
    handleResize();
    
    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}
