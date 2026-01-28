import React from "react";

/* ============================================================
   JOLYO THEME TOKENS
   ============================================================ */
const GRADIENT = "linear-gradient(135deg, #ff7b54 0%, #ff5277 50%, #9333ea 100%)";
const GRADIENT_TEXT = "linear-gradient(135deg, #ff7b54 0%, #9333ea 100%)";

/* ============================================================
   KEYFRAME ANIMATIONS
   ============================================================ */
const STYLE_INJECTION = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -20px) scale(1.05); }
  66% { transform: translate(-15px, 15px) scale(0.95); }
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.02); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes sparkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}
`;

const ensureStyleInjected = (() => {
  let injected = false;
  return () => {
    if (!injected && typeof document !== "undefined") {
      const style = document.createElement("style");
      style.textContent = STYLE_INJECTION;
      document.head.appendChild(style);
      injected = true;
    }
  };
})();

/* ============================================================
   TYPING PROMPT IDEAS COMPONENT
   ============================================================ */
const TypingPromptIdeas: React.FC = () => {
  const prompts = [
    "Build me a landing page for a SaaS product...",
    "Create a beautiful dashboard with charts...",
    "Design a modern e-commerce storefront...",
    "Make a portfolio site with animations...",
    "Build a task management app UI...",
  ];

  const [currentPrompt, setCurrentPrompt] = React.useState(0);
  const [display, setDisplay] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const text = prompts[currentPrompt];
    let speed = isDeleting ? 30 : 50;

    const handler = setTimeout(() => {
      if (!isDeleting) {
        if (display.length < text.length) {
          setDisplay(text.slice(0, display.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (display.length > 0) {
          setDisplay(display.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentPrompt((prev: number) => (prev + 1) % prompts.length);
        }
      }
    }, speed);

    return () => clearTimeout(handler);
  }, [display, isDeleting, currentPrompt]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "12px 20px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(12px)",
        borderRadius: "12px",
        border: "1px solid rgba(255, 123, 84, 0.15)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
        minHeight: "48px",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <span style={{ color: "#9333ea", fontSize: "16px" }}>💡</span>
      <span
        style={{
          color: "#4b5563",
          fontSize: "14px",
          fontWeight: 500,
          fontStyle: "italic",
          minWidth: "280px",
        }}
      >
        "{display}
        <span
          style={{
            display: "inline-block",
            width: "2px",
            height: "16px",
            background: "#9333ea",
            marginLeft: "2px",
            animation: "blink 0.8s steps(1) infinite",
            verticalAlign: "middle",
          }}
        />
        "
      </span>
    </div>
  );
};

/* ============================================================
   SPARKLE COMPONENT
   ============================================================ */
const Sparkle: React.FC<{ style?: React.CSSProperties }> = ({ style }: { style?: React.CSSProperties }) => (
  <div
    style={{
      position: "absolute",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: GRADIENT,
      animation: "sparkle 2s ease-in-out infinite",
      ...style,
    }}
  />
);

/* ============================================================
   MAIN BLANK TEMPLATE PAGE
   ============================================================ */
const Index: React.FC = () => {
  ensureStyleInjected();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "hsl(30 20% 98%)",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Subtle grain texture */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.03,
          zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }}
      />

      {/* Animated gradient orbs */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "hsl(4 86% 68%)",
          filter: "blur(120px)",
          opacity: 0.12,
          top: "-200px",
          right: "-150px",
          animation: "float 12s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "hsl(262 83% 58%)",
          filter: "blur(100px)",
          opacity: 0.1,
          bottom: "-150px",
          left: "-100px",
          animation: "float 10s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "hsl(340 82% 62%)",
          filter: "blur(80px)",
          opacity: 0.08,
          top: "40%",
          left: "60%",
          animation: "float 8s ease-in-out infinite",
          animationDelay: "4s",
        }}
      />

      {/* Sparkles */}
      <Sparkle style={{ top: "20%", left: "15%", animationDelay: "0s" }} />
      <Sparkle style={{ top: "30%", right: "20%", animationDelay: "0.5s" }} />
      <Sparkle style={{ bottom: "25%", left: "25%", animationDelay: "1s" }} />
      <Sparkle style={{ bottom: "35%", right: "15%", animationDelay: "1.5s" }} />

      {/* Content Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "40px",
          maxWidth: "600px",
          animation: "fadeInUp 0.8s ease-out",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "90px",
            height: "90px",
            margin: "0 auto 28px",
            borderRadius: "28px",
            background: GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 40px rgba(255, 123, 84, 0.3)",
            animation: "floatIcon 4s ease-in-out infinite",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="44"
            height="44"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "clamp(28px, 5vw, 38px)",
            fontWeight: 800,
            color: "hsl(228 45% 8%)",
            marginBottom: "12px",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          Your Canvas Awaits
        </h1>

        {/* Subheading with gradient */}
        <p
          style={{
            fontSize: "18px",
            fontWeight: 600,
            background: GRADIENT_TEXT,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "16px",
          }}
        >
          Ready to bring your ideas to life
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: "15px",
            color: "hsl(228 20% 45%)",
            lineHeight: 1.7,
            marginBottom: "32px",
            maxWidth: "450px",
            margin: "0 auto 32px",
          }}
        >
          This is your blank canvas. Simply describe what you want to build in the chat,
          and watch as your AI agent transforms your vision into reality.
        </p>

        {/* Typing Prompt Ideas */}
        <TypingPromptIdeas />

        {/* Arrow indicator */}
        <div
          style={{
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9333ea"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#9333ea",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Start with a prompt
          </span>
        </div>

        {/* Footer branding */}
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            color: "hsl(228 20% 60%)",
          }}
        >
          Powered by
          <span
            style={{
              fontWeight: 700,
              background: GRADIENT_TEXT,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Jolyo
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;

