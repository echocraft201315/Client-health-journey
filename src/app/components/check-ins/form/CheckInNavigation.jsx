import React from 'react';
import { Button } from '../../../components/ui/button';

const CheckInNavigation = ({
  currentTab,
  setCurrentTab,
  isSubmitting,
  onSubmit
}) => {
  const tabs = ["measurements", "wellness", "nutrition", "supplements"];
  
  const handlePrevious = () => {
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };
  
  const handleNext = () => {
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };
  
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between w-full">
      <Button 
        type="button" 
        variant="outline" 
        onClick={handlePrevious}
        disabled={currentTab === "measurements" || isSubmitting}
        className="w-full sm:w-auto"
      >
        Previous
      </Button>
      
      {currentTab !== "supplements" ? (
        <Button 
          type="button" 
          onClick={handleNext}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Next
        </Button>
      ) : (
        <Button 
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent border-white rounded-full"></span>
              Submitting...
            </span>
          ) : (
            "Submit Check-in"
          )}
        </Button>
      )}
    </div>
  );
};

export default CheckInNavigation;
