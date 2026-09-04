'use client';

import { useState } from "react";

export function CookieBar() {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;

  return (
    <div className="cine-cookie" role="dialog" aria-label="Cookie notice">
      <span>We use cookies to enhance your experience.</span>
      <button onClick={() => setHidden(true)} type="button">
        Decline
      </button>
      <button onClick={() => setHidden(true)} type="button">
        Accept
      </button>
    </div>
  );
}
