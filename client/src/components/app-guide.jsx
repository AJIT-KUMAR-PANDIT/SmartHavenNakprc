import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataMode } from '@/contexts/data-mode-context';
import { Button } from '@/components/ui/button';
import { X, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';

const AppGuide = () => {
  const { 
    showGuide, 
    toggleGuide, 
    getCurrentGuideStep, 
    nextGuideStep, 
    prevGuideStep,
    currentGuideStep,
    mockData
  } = useDataMode();
  
  const [targetElement, setTargetElement] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [placement, setPlacement] = useState('bottom');
  
  // Get current guide step
  const guideStep = getCurrentGuideStep();
  
  useEffect(() => {
    if (!showGuide || !guideStep) return;
    
    // Find the target element
    let target;
    if (guideStep.target === 'body') {
      target = document.body;
    } else {
      target = document.querySelector(guideStep.target);
    }
    
    setTargetElement(target);
    
    if (target) {
      updatePosition(target, guideStep.position);
      
      // Scroll to the element if it's not in view
      if (guideStep.target !== 'body') {
        const rect = target.getBoundingClientRect();
        const isInView = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= window.innerHeight &&
          rect.right <= window.innerWidth
        );
        
        if (!isInView) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [showGuide, guideStep]);
  
  // Update position when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (targetElement) {
        updatePosition(targetElement, guideStep.position);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetElement, guideStep]);
  
  // Calculate position of guide tooltip based on target element
  const updatePosition = (target, preferredPosition) => {
    if (!target) return;
    
    const rect = target.getBoundingClientRect();
    const tooltipWidth = 300; // approximate width of tooltip
    const tooltipHeight = 200; // approximate height of tooltip
    const margin = 15; // margin from target element
    
    let top, left;
    let calculatedPlacement = preferredPosition;
    
    if (target === document.body || preferredPosition === 'center') {
      // Center in viewport
      top = window.innerHeight / 2 - tooltipHeight / 2;
      left = window.innerWidth / 2 - tooltipWidth / 2;
      calculatedPlacement = 'center';
    } else {
      // Position relative to target
      switch (preferredPosition) {
        case 'top':
          top = rect.top - tooltipHeight - margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          // Fallback if no space above
          if (top < 0) {
            top = rect.bottom + margin;
            calculatedPlacement = 'bottom';
          }
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.right + margin;
          // Fallback if no space to the right
          if (left + tooltipWidth > window.innerWidth) {
            left = rect.left - tooltipWidth - margin;
            calculatedPlacement = 'left';
          }
          break;
        case 'bottom':
          top = rect.bottom + margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          // Fallback if no space below
          if (top + tooltipHeight > window.innerHeight) {
            top = rect.top - tooltipHeight - margin;
            calculatedPlacement = 'top';
          }
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltipHeight / 2;
          left = rect.left - tooltipWidth - margin;
          // Fallback if no space to the left
          if (left < 0) {
            left = rect.right + margin;
            calculatedPlacement = 'right';
          }
          break;
        default:
          // Default to bottom
          top = rect.bottom + margin;
          left = rect.left + rect.width / 2 - tooltipWidth / 2;
          calculatedPlacement = 'bottom';
      }
      
      // Ensure tooltip stays within viewport
      if (left < margin) left = margin;
      if (left + tooltipWidth > window.innerWidth - margin) {
        left = window.innerWidth - tooltipWidth - margin;
      }
      if (top < margin) top = margin;
      if (top + tooltipHeight > window.innerHeight - margin) {
        top = window.innerHeight - tooltipHeight - margin;
      }
    }
    
    setPosition({ top, left });
    setPlacement(calculatedPlacement);
  };
  
  // If guide is hidden or no guide step is available, don't render
  if (!showGuide || !guideStep) return null;
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 pointer-events-auto" onClick={toggleGuide}>
        {targetElement && targetElement !== document.body && (
          <div 
            className="absolute border-2 border-blue-500 rounded-md pointer-events-none z-[51]"
            style={{
              top: targetElement.getBoundingClientRect().top - 4,
              left: targetElement.getBoundingClientRect().left - 4,
              width: targetElement.getBoundingClientRect().width + 8,
              height: targetElement.getBoundingClientRect().height + 8
            }}
          />
        )}
        
        <motion.div
          className="absolute bg-[#1e1e2e] rounded-lg shadow-xl border border-gray-700 p-5 w-[300px] z-[52] pointer-events-auto"
          style={{ top: position.top, left: position.left }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow indicator based on placement */}
          {placement !== 'center' && (
            <div 
              className={`absolute w-3 h-3 bg-[#1e1e2e] border-t border-l border-gray-700 transform ${
                placement === 'bottom' ? 'top-[-7px] left-1/2 -translate-x-1/2 rotate-45' :
                placement === 'top' ? 'bottom-[-7px] left-1/2 -translate-x-1/2 rotate-[225deg]' :
                placement === 'left' ? 'right-[-7px] top-1/2 -translate-y-1/2 rotate-[135deg]' :
                'left-[-7px] top-1/2 -translate-y-1/2 rotate-[-45deg]'
              }`}
            />
          )}
          
          {/* Close button */}
          <button 
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            onClick={toggleGuide}
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Guide content */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2 text-blue-500">{guideStep.title}</h3>
            <p className="text-gray-300">{guideStep.message}</p>
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-400">
                Step {currentGuideStep + 1} of {mockData.guideSteps.length}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={prevGuideStep}
                disabled={currentGuideStep === 0}
                className="border-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={nextGuideStep}
                className="border-gray-700"
              >
                {currentGuideStep === mockData.guideSteps.length - 1 ? (
                  'Finish'
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Help button to re-open the guide
export const GuideButton = () => {
  const { showGuide, toggleGuide, resetGuide } = useDataMode();
  
  if (showGuide) return null;
  
  return (
    <Button
      className="fixed bottom-20 right-4 lg:bottom-4 rounded-full p-3 shadow-lg bg-blue-600 hover:bg-blue-700 z-40"
      onClick={resetGuide}
    >
      <HelpCircle className="h-5 w-5" />
    </Button>
  );
};

export default AppGuide;