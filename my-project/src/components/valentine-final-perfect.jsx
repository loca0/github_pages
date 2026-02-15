import React, { useState, useEffect, useRef, useMemo } from 'react';

const ValentineEnvelope = () => {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noAttempts, setNoAttempts] = useState(0);
  const [fireworks, setFireworks] = useState([]);
  const [roses, setRoses] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const noButtonRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(0); // how many chars are shown in the heart
  const writeIntervalRef = useRef(null);
  const writeTimeoutRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setTimeout(() => {
      setEnvelopeOpen(true);
      setTimeout(() => setShowQuestion(true), 2500);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const moveNoButton = () => {
    const button = noButtonRef.current;
    if (!button) return;
    
    const maxX = window.innerWidth - 180;
    const maxY = window.innerHeight - 100;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    setNoButtonPos({ x: randomX, y: randomY });
    setNoAttempts(prev => prev + 1);
  };

  const handleYes = () => {
    setShowHeart(true);
    createFireworks();
    createRoses();
  };

  const createFireworks = () => {
    const interval = setInterval(() => {
      const newFirework = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        y: 100 + Math.random() * (window.innerHeight * 0.4),
      };
      setFireworks(prev => [...prev, newFirework]);
      
      setTimeout(() => {
        setFireworks(prev => prev.filter(fw => fw.id !== newFirework.id));
      }, 2000);
    }, 250);

    setTimeout(() => clearInterval(interval), 15000);
  };

  const createRoses = () => {
    const interval = setInterval(() => {
      const newRose = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 2,
      };
      setRoses(prev => [...prev, newRose]);
      
      setTimeout(() => {
        setRoses(prev => prev.filter(r => r.id !== newRose.id));
      }, 6000);
    }, 400);

    setTimeout(() => clearInterval(interval), 15000);
  };

  // Generate heart path points for "I love you baby" text
  const generateHeartPoints = (numPoints) => {
    const points = [];
    const text = "I love you baby ";
    let textIndex = 0;
    
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * Math.PI * 2;
      // Heart parametric equation
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      
      const char = text[textIndex % text.length];
      textIndex++;
      
      points.push({ x, y, char, index: i });
    }
    
    return points;
  };

  // memoize heart points so they don't regenerate every render
  const heartPoints = useMemo(() => generateHeartPoints(80), []);

  // Writing animation: reveal characters one by one, then loop after a pause
  useEffect(() => {
    // cleanup helper
    const clearTimers = () => {
      if (writeIntervalRef.current) {
        clearInterval(writeIntervalRef.current);
        writeIntervalRef.current = null;
      }
      if (writeTimeoutRef.current) {
        clearTimeout(writeTimeoutRef.current);
        writeTimeoutRef.current = null;
      }
    };

    if (!showHeart) {
      clearTimers();
      setVisibleCount(0);
      return;
    }

    let idx = 0;
    const startWriting = () => {
      setVisibleCount(0);
      idx = 0;
      const speed = isMobile ? 40 : 25; // ms per char
      writeIntervalRef.current = setInterval(() => {
        idx += 1;
        setVisibleCount(idx);
        if (idx >= heartPoints.length) {
          // finished, clear interval and wait before restarting
          clearTimers();
          writeTimeoutRef.current = setTimeout(() => {
            startWriting();
          }, 2000);
        }
      }, speed);
    };

    startWriting();

    return () => clearTimers();
  }, [showHeart, isMobile]);

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Crimson+Text:wght@400;600;700&family=Great+Vibes&display=swap');
        
        * {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(5deg); }
        }
        
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.15); }
          28% { transform: scale(1); }
          42% { transform: scale(1.15); }
          70% { transform: scale(1); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fallRose {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes rotate3DHeart {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes glowPulse {
          0%, 100% { 
            text-shadow: 0 0 10px #ff1744, 0 0 20px #ff1744, 0 0 30px #ff1744, 0 0 40px #ff1744;
            opacity: 1;
          }
          50% { 
            text-shadow: 0 0 20px #ff1744, 0 0 30px #ff1744, 0 0 40px #ff1744, 0 0 50px #ff1744, 0 0 60px #ff1744;
            opacity: 0.9;
          }
        }
        
        @keyframes letterFloat {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-8px) scale(1.05);
          }
        }
        
        @keyframes envelopeFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
      `}</style>

      {/* Background */}
      <div style={styles.backgroundGradient}>
        <div style={styles.gradientOrb1} />
        <div style={styles.gradientOrb2} />
        <div style={styles.gradientOrb3} />
      </div>
      
      {/* Stars */}
      {[...Array(isMobile ? 15 : 30)].map((_, i) => (
        <div
          key={`star-${i}`}
          style={{
            position: 'absolute',
            width: isMobile ? '2px' : '3px',
            height: isMobile ? '2px' : '3px',
            borderRadius: '50%',
            background: '#fff',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            zIndex: 2,
            boxShadow: '0 0 4px #fff',
          }}
        />
      ))}

      {/* Floating Hearts */}
      {[...Array(isMobile ? 10 : 20)].map((_, i) => (
        <div
          key={`heart-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: isMobile ? `${10 + Math.random() * 15}px` : `${15 + Math.random() * 25}px`,
            opacity: 0.1,
            animation: `float ${10 + Math.random() * 5}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            zIndex: 1,
            color: '#ff1744',
            pointerEvents: 'none',
          }}
        >
          ♥
        </div>
      ))}

      {!showHeart ? (
        <div style={{
          ...styles.mainContent,
          padding: isMobile ? '20px' : '0',
        }}>
          {/* Ultra Realistic Envelope */}
          <div style={{
            ...styles.envelopeScene,
            animation: !envelopeOpen ? 'envelopeFloat 3s ease-in-out infinite' : 'none',
          }}>
            <div style={{
              ...styles.envelopeContainer3D,
              width: isMobile ? '85vw' : '500px',
              maxWidth: '500px',
            }}>
              {/* Envelope back panel */}
              <div style={styles.envelopeBackPanel}>
                <div style={styles.envelopeBackInner} />
              </div>
              
              {/* Letter card that slides out */}
              <div style={{
                ...styles.letterSlideOut,
                transform: envelopeOpen 
                  ? `translateY(-280px) translateZ(20px) scale(1)` 
                  : 'translateY(20px) translateZ(0px) scale(0.95)',
                opacity: envelopeOpen ? 1 : 0,
                transition: 'all 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                transitionDelay: envelopeOpen ? '0.8s' : '0s',
              }}>
                <div style={styles.letterInner}>
                  <div style={styles.letterDecoration}>
                    <div style={styles.letterIcon}>💌</div>
                  </div>
                  <div style={styles.letterMessage}>
                    <span style={styles.letterMessageText}>For You...</span>
                  </div>
                </div>
              </div>
              
              {/* Envelope front panel */}
              <div style={styles.envelopeFrontPanel}>
                <div style={styles.envelopeFrontInner}>
                  {/* Decorative pattern */}
                  <div style={styles.envelopeDecorPattern} />
                </div>
              </div>
              
              {/* Top flap with realistic fold */}
              <div style={{
                ...styles.envelopeTopFlap,
                transform: envelopeOpen 
                  ? 'rotateX(-180deg) translateZ(1px)' 
                  : 'rotateX(0deg) translateZ(1px)',
                transition: 'transform 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              }}>
                <div style={styles.flapTriangle} />
                {/* Flap shadow */}
                <div style={styles.flapShadow} />
              </div>
              
              {/* Wax seal */}
              <div style={{
                ...styles.waxSealRealistic,
                transform: envelopeOpen 
                  ? 'scale(0) rotate(360deg)' 
                  : 'scale(1) rotate(0deg)',
                opacity: envelopeOpen ? 0 : 1,
                transition: 'all 1s ease-out',
              }}>
                <div style={styles.sealTexture}>
                  <span style={styles.sealEmoji}>💕</span>
                </div>
              </div>
              
              {/* Envelope shadows */}
              <div style={styles.envelopeShadow} />
            </div>
          </div>

          {/* Question */}
          {showQuestion && (
            <div style={{
              ...styles.questionSection,
              padding: isMobile ? '0 20px' : '0',
            }}>
              <div style={styles.titleWrapper}>
                <h1 style={{
                  ...styles.mainTitle,
                  fontSize: isMobile ? '32px' : '48px',
                }}>Will You Be</h1>
                <h1 style={{
                  ...styles.mainTitleAccent,
                  fontSize: isMobile ? '36px' : '56px',
                }}>My Valentine?</h1>
              </div>
              
              <p style={{
                ...styles.subtitle,
                fontSize: isMobile ? '16px' : '22px',
              }}>
                I have a question that's been on my mind...
              </p>
              
              <div style={styles.decorativeLine}>
                <span>♥</span>
              </div>
              
              <div style={{
                ...styles.buttonsWrapper,
                flexDirection: isMobile && noAttempts === 0 ? 'column' : 'row',
                gap: isMobile ? '20px' : '40px',
              }}>
                <button 
                  onClick={handleYes}
                  style={{
                    ...styles.yesButton,
                    padding: isMobile ? '18px 50px' : '25px 70px',
                    fontSize: isMobile ? '24px' : '32px',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = isMobile ? 'scale(1.05)' : 'scale(1.15) translateY(-5px)';
                    e.target.style.boxShadow = '0 20px 60px rgba(255, 23, 68, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1) translateY(0)';
                    e.target.style.boxShadow = '0 15px 45px rgba(255, 23, 68, 0.5)';
                  }}
                >
                  <span style={styles.buttonSparkle}>✨</span>
                  YES
                  <span style={styles.buttonSparkle}>✨</span>
                </button>
                
                <button 
                  ref={noButtonRef}
                  onMouseEnter={moveNoButton}
                  onTouchStart={moveNoButton}
                  onClick={moveNoButton}
                  style={{
                    ...styles.noButton,
                    padding: isMobile ? '16px 45px' : '22px 60px',
                    fontSize: isMobile ? '20px' : '28px',
                    position: noAttempts > 0 ? 'fixed' : 'relative',
                    left: noAttempts > 0 ? `${noButtonPos.x}px` : 'auto',
                    top: noAttempts > 0 ? `${noButtonPos.y}px` : 'auto',
                    transition: `all ${Math.max(0.15, 0.4 - noAttempts * 0.04)}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
                    transform: noAttempts > 0 ? `rotate(${Math.random() * 360}deg)` : 'rotate(0deg)',
                  }}
                >
                  NO
                </button>
              </div>
              
              {noAttempts > 2 && (
                <p style={{
                  ...styles.encouragement,
                  fontSize: isMobile ? '16px' : '20px',
                }}>
                  {noAttempts > 5 ? "Pretty please? 🥺💕" : "Are you sure about that? 💗"}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Heart Scene - TEXT PARTICLE HEART */
        <div style={styles.heartScene}>
          {/* Falling Roses */}
          {roses.map(rose => (
            <div
              key={rose.id}
              style={{
                position: 'absolute',
                left: rose.x,
                top: -100,
                fontSize: isMobile ? '20px' : '30px',
                animation: 'fallRose 5s linear forwards',
                animationDelay: `${rose.delay}s`,
                zIndex: 100,
              }}
            >
              🌹
            </div>
          ))}

          {/* Heart Display */}
          <div style={{
            ...styles.heartDisplay,
            gap: isMobile ? '50px' : '80px',
          }}>
            {/* "I love you baby" Text Particle Heart */}
            <div style={{
              ...styles.heartContainer,
              width: isMobile ? '320px' : '550px',
              height: isMobile ? '320px' : '550px',
            }}>
              <div style={styles.heart3DWrapper}>
                {/* Heart made from "I love you baby" text particles */}
                {heartPoints.map((point, i) => (
                  i < visibleCount ? (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(${point.x * (isMobile ? 8 : 11)}px, ${point.y * (isMobile ? 8 : 11)}px)`,
                        color: '#ff1744',
                        fontSize: isMobile ? '18px' : '24px',
                        fontWeight: 700,
                        fontFamily: 'Arial, sans-serif',
                        animation: `glowPulse ${2 + (i % 3) * 0.3}s ease-in-out infinite, letterFloat ${3 + (i % 2)}s ease-in-out infinite`,
                        animationDelay: `${i * 0.02}s, ${i * 0.03}s`,
                        letterSpacing: '0.5px',
                        textShadow: '0 0 10px #ff1744, 0 0 20px #ff1744, 0 0 30px #ff1744',
                        pointerEvents: 'none',
                      }}
                    >
                      {point.char}
                    </div>
                  ) : null
                 ))}

                {/* Center message */}
                <div style={styles.heartCenterText}>
                  <div style={{
                    fontSize: isMobile ? '28px' : '40px',
                    fontFamily: '"Great Vibes", cursive',
                    color: '#fff',
                    textShadow: '0 0 20px rgba(255, 23, 68, 1), 0 0 40px rgba(255, 23, 68, 0.8)',
                    animation: 'glowPulse 2s ease-in-out infinite',
                  }}>
                    I love you
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div style={styles.messageContainer}>
              <h2 style={{
                ...styles.loveMessage,
                fontSize: isMobile ? '42px' : '68px',
              }}>I Love You Baby</h2>
              <div style={{
                ...styles.messageDivider,
                fontSize: isMobile ? '22px' : '32px',
              }}>♥ ✦ ♥</div>
              <h3 style={{
                ...styles.valentineMessage,
                fontSize: isMobile ? '26px' : '40px',
              }}>Happy Valentine's Day</h3>
              <p style={{
                ...styles.dateText,
                fontSize: isMobile ? '18px' : '24px',
              }}>February 14, 2026</p>
            </div>
          </div>

          {/* Fireworks */}
          {fireworks.map(fw => (
            <div key={fw.id} style={{ position: 'absolute', left: fw.x, top: fw.y, zIndex: 50 }}>
              {[...Array(isMobile ? 25 : 40)].map((_, i) => {
                const angle = (i / (isMobile ? 25 : 40)) * Math.PI * 2;
                const distance = isMobile ? 60 : 80 + Math.random() * 70;
                const colors = ['#ff1744', '#ff5252', '#ff80ab', '#ff4081', '#ffc1e3'];
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      width: isMobile ? '4px' : '6px',
                      height: isMobile ? '4px' : '6px',
                      borderRadius: '50%',
                      background: colors[Math.floor(Math.random() * colors.length)],
                      boxShadow: `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`,
                      animation: 'sparkle 1.5s ease-out forwards',
                      animationDelay: `${i * 0.015}s`,
                      transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #ff6b9d 0%, #ffa6c9 25%, #ffb3d9 50%, #ffc1e3 75%, #ffe5f0 100%)',
    zIndex: 0,
  },
  gradientOrb1: {
    position: 'absolute',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,107,157,0.4) 0%, transparent 70%)',
    top: '-200px',
    left: '-200px',
    animation: 'float 20s ease-in-out infinite',
  },
  gradientOrb2: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,193,227,0.3) 0%, transparent 70%)',
    bottom: '-150px',
    right: '-150px',
    animation: 'float 15s ease-in-out infinite reverse',
  },
  gradientOrb3: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,179,217,0.35) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    animation: 'pulse 10s ease-in-out infinite',
  },
  mainContent: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '100px',
    width: '100%',
  },
  envelopeScene: {
    position: 'relative',
    perspective: '2000px',
    transformStyle: 'preserve-3d',
  },
  envelopeContainer3D: {
    position: 'relative',
    height: '330px',
    transformStyle: 'preserve-3d',
    filter: 'drop-shadow(0 40px 80px rgba(255, 107, 157, 0.5))',
  },
  envelopeBackPanel: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    zIndex: 1,
  },
  envelopeBackInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
    border: '5px solid #ff8fb3',
    borderRadius: '12px',
    boxShadow: 'inset 0 0 40px rgba(255, 107, 157, 0.15), 0 10px 40px rgba(0, 0, 0, 0.2)',
  },
  envelopeFrontPanel: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    zIndex: 3,
    pointerEvents: 'none',
  },
  envelopeFrontInner: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #ffffff 0%, #fff5f8 100%)',
    border: '5px solid #ff8fb3',
    borderRadius: '12px',
    boxShadow: 'inset 0 0 30px rgba(255, 107, 157, 0.1)',
  },
  envelopeDecorPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 15px,
      rgba(255, 107, 157, 0.04) 15px,
      rgba(255, 107, 157, 0.04) 30px
    )`,
    borderRadius: '12px',
  },
  envelopeTopFlap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transformOrigin: 'top center',
    transformStyle: 'preserve-3d',
    zIndex: 4,
  },
  flapTriangle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #ffb3d9 0%, #ff8fb3 100%)',
    clipPath: 'polygon(0 0, 100% 0, 50% 70%)',
    filter: 'drop-shadow(0 15px 35px rgba(255, 107, 157, 0.4))',
  },
  flapShadow: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '70%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 100%)',
    clipPath: 'polygon(0 0, 100% 0, 50% 70%)',
  },
  letterSlideOut: {
    position: 'absolute',
    top: '40px',
    left: '8%',
    width: '84%',
    height: '380px',
    transformStyle: 'preserve-3d',
    zIndex: 5,
  },
  letterInner: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, #fffbfd 0%, #ffffff 100%)',
    border: '3px solid #ffe5f0',
    borderRadius: '10px',
    boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  letterDecoration: {
    padding: '30px',
    borderBottom: '2px solid #ffe5f0',
    display: 'flex',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom, #fff 0%, #fffbfd 100%)',
  },
  letterIcon: {
    fontSize: '70px',
    animation: 'heartBeat 2s ease-in-out infinite',
  },
  letterMessage: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterMessageText: {
    fontFamily: '"Great Vibes", cursive',
    fontSize: '42px',
    color: '#ff1744',
    textShadow: '0 2px 4px rgba(255, 23, 68, 0.3)',
  },
  waxSealRealistic: {
    position: 'absolute',
    top: '38%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '85px',
    height: '85px',
    borderRadius: '50%',
    zIndex: 6,
    transition: 'all 1s ease-out',
  },
  sealTexture: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 35%, #ff1744 0%, #d32f2f 50%, #b71c1c 100%)',
    border: '5px solid #8b0000',
    boxShadow: '0 8px 30px rgba(139, 0, 0, 0.7), inset -3px -3px 10px rgba(0, 0, 0, 0.5), inset 3px 3px 10px rgba(255, 107, 157, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 2s ease-in-out infinite',
  },
  sealEmoji: {
    fontSize: '32px',
  },
  envelopeShadow: {
    position: 'absolute',
    bottom: '-30px',
    left: '10%',
    width: '80%',
    height: '30px',
    background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.2) 0%, transparent 70%)',
    filter: 'blur(15px)',
    zIndex: 0,
  },
  questionSection: {
    textAlign: 'center',
    animation: 'fadeInUp 1s ease-out',
    maxWidth: '700px',
    width: '100%',
  },
  titleWrapper: {
    marginBottom: '30px',
  },
  mainTitle: {
    fontFamily: '"Cinzel Decorative", serif',
    fontWeight: 700,
    color: '#fff',
    textShadow: '0 6px 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 107, 157, 0.4)',
    margin: 0,
    letterSpacing: '2px',
    animation: 'slideDown 1s ease-out',
  },
  mainTitleAccent: {
    fontFamily: '"Cinzel Decorative", serif',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #ff1744 0%, #ff5252 50%, #ff80ab 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: '10px 0 0 0',
    letterSpacing: '3px',
    animation: 'slideDown 1.2s ease-out',
    filter: 'drop-shadow(0 4px 10px rgba(255, 23, 68, 0.4))',
  },
  subtitle: {
    fontFamily: '"Crimson Text", serif',
    color: '#fff',
    opacity: 0.95,
    marginBottom: '40px',
    fontWeight: 600,
    fontStyle: 'italic',
    letterSpacing: '0.5px',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  },
  decorativeLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '30px 0',
    fontSize: '24px',
    color: '#fff',
    opacity: 0.8,
    animation: 'pulse 2s ease-in-out infinite',
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100px',
    marginTop: '20px',
  },
  yesButton: {
    fontFamily: '"Cinzel Decorative", serif',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #ff0844 0%, #ff1744 50%, #ff5252 100%)',
    color: 'white',
    borderRadius: '60px',
    cursor: 'pointer',
    boxShadow: '0 15px 45px rgba(255, 23, 68, 0.5)',
    transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    letterSpacing: '4px',
    position: 'relative',
    overflow: 'hidden',
    zIndex: 10,
    border: '3px solid rgba(255, 255, 255, 0.3)',
  },
  buttonSparkle: {
    display: 'inline-block',
    margin: '0 10px',
    animation: 'sparkle 1.5s ease-in-out infinite',
  },
  noButton: {
    fontFamily: '"Cinzel Decorative", serif',
    fontWeight: 600,
    background: 'linear-gradient(135deg, #bdbdbd 0%, #9e9e9e 100%)',
    color: 'white',
    borderRadius: '60px',
    cursor: 'pointer',
    boxShadow: '0 10px 35px rgba(0, 0, 0, 0.3)',
    letterSpacing: '3px',
    zIndex: 9,
    border: '3px solid rgba(255, 255, 255, 0.2)',
  },
  encouragement: {
    marginTop: '40px',
    fontFamily: '"Crimson Text", serif',
    color: '#fff',
    fontStyle: 'italic',
    opacity: 0.95,
    animation: 'fadeInUp 0.6s ease-out',
    textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  },
  heartScene: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a0a1e 0%, #2d1b3d 50%, #1a0a1e 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeInUp 1.2s ease-out',
  },
  heartDisplay: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 101,
  },
  heartContainer: {
    position: 'relative',
    transformStyle: 'preserve-3d',
    perspective: '1500px',
  },
  heart3DWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    animation: 'rotate3DHeart 6s ease-in-out infinite, heartBeat 1.5s ease-in-out infinite',
    transformStyle: 'preserve-3d',
  },
  heartCenterText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    textAlign: 'center',
  },
  messageContainer: {
    textAlign: 'center',
    zIndex: 102,
    padding: '0 20px',
  },
  loveMessage: {
    fontFamily: '"Great Vibes", cursive',
    fontWeight: 400,
    background: 'linear-gradient(135deg, #ff1744 0%, #ff5252 50%, #ff80ab 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '2px',
    marginBottom: '20px',
    filter: 'drop-shadow(0 0 30px rgba(255, 23, 68, 0.6))',
    animation: 'fadeInUp 1.5s ease-out',
  },
  messageDivider: {
    color: '#ff80ab',
    margin: '20px 0',
    opacity: 0.9,
    animation: 'fadeInUp 1.7s ease-out',
  },
  valentineMessage: {
    fontFamily: '"Cinzel Decorative", serif',
    fontWeight: 700,
    color: '#ffc1e3',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    textShadow: '0 0 20px rgba(255, 193, 227, 0.6)',
    animation: 'fadeInUp 1.9s ease-out',
  },
  dateText: {
    fontFamily: '"Crimson Text", serif',
    color: '#ff80ab',
    marginTop: '20px',
    fontStyle: 'italic',
    opacity: 0.8,
    animation: 'fadeInUp 2.1s ease-out',
  },
};

export default ValentineEnvelope;

