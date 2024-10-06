import { useState, useEffect } from 'react'
import { vctIcon } from "../../assets/svgs"
import "./animation.css"

export default function LogoAnimation() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowAnimation(false);

    }, 400); // 1000 milliseconds = 1 second

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {showAnimation && (
        <div className="animation">
          {vctIcon}
        </div>
      )}
    </>
  )
}