import { useState, useEffect } from "react";
import "./Error.css";

function Error() {
  const [isErrorVisible, setIsErrorVisible] = useState(false);

  useEffect(() => {
    setIsErrorVisible(true);

    setTimeout(() => {
      setIsErrorVisible(false);
    }, 3000); 
  }, []);

  return (
    <>
      {isErrorVisible && (
        <div className="error-overlay">
          <div className="error-modal">
            <div className="error-message">Error: Receipt Invalid</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Error;
