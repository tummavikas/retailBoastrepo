import { useEffect, useRef, useState } from 'react';

const ScratchCard = ({ 
  prizeContent, 
  overlayImage = '/scratch-overlay.png', 
  scratchRadius = 20 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        setCtx(context);
        initCanvas(context);
      }
    }
  }, []);

  const initCanvas = (context) => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    context.scale(dpr, dpr);

    context.fillStyle = 'gray';
    context.fillRect(0, 0, width, height);
    
    const img = new Image();
    img.src = overlayImage;
    img.onload = () => {
      context.globalCompositeOperation = 'source-over';
      context.drawImage(img, 0, 0, width, height);
    };
  };

  const getCanvasCoordinates = (clientX, clientY) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvasRef.current.width / rect.width) / window.devicePixelRatio;
    const y = (clientY - rect.top) * (canvasRef.current.height / rect.height) / window.devicePixelRatio;
    return { x, y };
  };

  const draw = (x, y) => {
    if (!ctx || isRevealed) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, scratchRadius, 0, Math.PI * 2);
    ctx.fill();
  };

  const handleMouseDown = (e) => {
    setIsScratching(true);
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    draw(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isScratching) return;
    const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
    draw(x, y);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
    checkReveal();
  };

  const handleTouchStart = (e) => {
    setIsScratching(true);
    const touch = e.touches[0];
    const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY);
    draw(x, y);
  };

  const handleTouchMove = (e) => {
    if (!isScratching) return;
    const touch = e.touches[0];
    const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY);
    draw(x, y);
  };

  const checkReveal = () => {
    if (!ctx || !canvasRef.current) return;

    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparentPixels++;
    }

    const transparency = transparentPixels / (pixels.length / 4);
    if (transparency > 0.3) {
      setIsRevealed(true);
    }
  };

  const resetScratch = () => {
    setIsRevealed(false);
    ctx && initCanvas(ctx);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-64 max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {prizeContent}
      </div>

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full touch-none ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      />

      {isRevealed && (
        <button
          onClick={resetScratch}
          className="absolute bottom-2 right-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default ScratchCard;