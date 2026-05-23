import React from 'react';

const ProductGallery = ({
  orderedImages,
  productName,
  zoomedImgId,
  zoomStyle,
  extractedBgColor,
  handleImageClick,
  handleImageMouseMove,
  handleImageMouseLeave,
  setLightboxImg
}) => {
  return (
    <div className="lg:col-span-7 space-y-6">
      {/* Mobile Carousel */}
      <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-none w-full gap-4 pb-2">
        {orderedImages.map((img, index) => {
          const isThisZoomed = zoomedImgId === (img.imageId || index);
          return (
            <div 
              key={img.imageId || index} 
              onClick={(e) => handleImageClick(e, img.imageId || index)}
              onMouseMove={(e) => handleImageMouseMove(e, img.imageId || index)}
              onMouseLeave={handleImageMouseLeave}
              className={`w-[85vw] sm:w-[65vw] shrink-0 aspect-[3/4] snap-start bg-surface-container overflow-hidden relative select-none ${
                isThisZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              style={{ backgroundColor: extractedBgColor }}
            >
              <img 
                src={img.imageUrl} 
                alt={`${productName} - View ${index + 1}`} 
                className="w-full h-full object-cover pointer-events-none transition-transform duration-200 ease-out"
                style={isThisZoomed ? zoomStyle : { transformOrigin: 'center', transform: 'scale(1)' }}
              />
              <div className="absolute bottom-4 left-4 bg-background/80 px-2 py-1 text-[9px] font-label tracking-widest uppercase">
                {index + 1} / {orderedImages.length}
              </div>
              {/* Fullscreen Trigger */}
              {!isThisZoomed && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImg(img.imageUrl);
                  }}
                  className="absolute bottom-4 right-4 bg-background/90 text-on-surface hover:bg-background hover:scale-105 w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center shadow-sm transition-all duration-300 z-10 cursor-pointer"
                  title="Xem toàn màn hình"
                >
                  <span className="material-symbols-outlined text-base font-light">fullscreen</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Vertical Stack */}
      <div className="hidden lg:flex flex-col gap-6">
        {orderedImages.map((img, index) => {
          const isThisZoomed = zoomedImgId === (img.imageId || index);
          return (
            <div 
              key={img.imageId || index} 
              onClick={(e) => handleImageClick(e, img.imageId || index)}
              onMouseMove={(e) => handleImageMouseMove(e, img.imageId || index)}
              onMouseLeave={handleImageMouseLeave}
              className={`w-full aspect-[3/4] bg-surface-container overflow-hidden relative select-none group ${
                isThisZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              style={{ backgroundColor: extractedBgColor }}
            >
              <img 
                src={img.imageUrl} 
                alt={`${productName} - View ${index + 1}`} 
                className="w-full h-full object-cover pointer-events-none transition-transform duration-200 ease-out"
                style={isThisZoomed ? zoomStyle : { transformOrigin: 'center', transform: 'scale(1)' }}
              />
              {/* Fullscreen Trigger */}
              {!isThisZoomed && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImg(img.imageUrl);
                  }}
                  className="absolute bottom-4 right-4 bg-background/90 text-on-surface hover:bg-background hover:scale-105 w-9 h-9 rounded-full border border-outline-variant/20 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 cursor-pointer"
                  title="Xem toàn màn hình"
                >
                  <span className="material-symbols-outlined text-lg font-light">fullscreen</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGallery;
