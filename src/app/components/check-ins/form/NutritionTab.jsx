import React, { useState, useEffect } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Plus, Trash2, Upload, Image as ImageIcon, Search } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { useClinic } from "@/app/context/ClinicContext";
// Image compression and optimization helper functions
const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 0.15, // Compress to max 150KB (0.15MB)
    maxWidthOrHeight: 800, // Max width or height 800px
    useWebWorker: true, // Use web worker for better performance
    fileType: 'image/jpeg', // Convert to JPEG
    quality: 0.8, // 80% quality
    ...options
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);
    return compressedFile;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

const validateImageFile = (file) => {
  const maxSize = 20 * 1024 * 1024; // 20MB (original file size limit)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload only JPEG, PNG, or WebP images.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 20MB.' };
  }
  
  return { valid: true };
};

const NutritionTab = ({ register, errors, formData, setValue, getValues }) => {
  const [uploadingImages, setUploadingImages] = useState({});
  const [analyzingImages, setAnalyzingImages] = useState({});
  const [imageFiles, setImageFiles] = useState({}); // To store compressed file objects
  const { planId } = useClinic();
  const [mealCount, setMealCount] = useState(formData.nutrition?.length > 0 ? formData.nutrition.length : 0);
console.log("planId",planId)
  // Ensure nutrition array matches mealCount
  useEffect(() => {
    if (mealCount === 0) return;
    const current = getValues("nutrition") || [];
    let updated = [...current];
    if (updated.length < mealCount) {
      // Add empty meals
      for (let i = updated.length; i < mealCount; i++) {
        updated.push({
          protein: "",
          proteinPortion: "",
          fruit: "",
          fruitPortion: "",
          vegetables: "",
          vegetablesPortion: "",
          carbs: "",
          carbsPortion: "",
          fats: "",
          fatsPortion: "",
          other: "",
          otherPortion: "",
          images: [],
        });
      }
    } else if (updated.length > mealCount) {
      updated = updated.slice(0, mealCount);
    }
    setValue("nutrition", updated, { shouldValidate: true, shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealCount]);

  // Live calories calculation
  useEffect(() => {
    const nutrition = getValues("nutrition") || [];
    const updatedNutrition = nutrition.map((item) => {
      const protein = item.proteinPortion || 0;
      const carbs = item.carbsPortion || 0;
      const fats = item.fatsPortion || 0;
      const calories = 4 * protein + 4 * carbs + 9 * fats;
      return {
        ...item,
        calories: calories ? calories.toFixed(1) : "0",
      };
    });
    setValue("nutrition", updatedNutrition, { shouldValidate: false, shouldDirty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.nutrition?.length, formData.nutrition?.map(i => `${i.proteinPortion}-${i.carbsPortion}-${i.fatsPortion}`).join(",")]);

  // Remove meal logic (for trash button)
  const removeNutrition = (index) => {
    const currentNutrition = getValues("nutrition") || [];
    const newNutrition = currentNutrition.filter((_, i) => i !== index);
    setValue("nutrition", newNutrition, { shouldValidate: true, shouldDirty: true });
    setMealCount(newNutrition.length);
  };

  const handleImageUpload = async (e, index) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(prev => ({ ...prev, [index]: true }));
    toast.info("Processing images...");

    try {
      const currentNutrition = getValues("nutrition");
      const updatedNutrition = [...currentNutrition];
      const processedFiles = [];
      const newImageUrls = [];

      // Process each file
      for (const file of files) {
        // Validate file
        const validation = validateImageFile(file);
        if (!validation.valid) {
          toast.error(validation.error);
          continue;
        }

        // Compress image if it's large
        let processedFile = file;
        if (file.size > 500 * 1024) { // Compress if larger than 500KB
          try {
            processedFile = await compressImage(file);
            const originalSize = (file.size / 1024 / 1024).toFixed(1);
            const compressedSize = (processedFile.size / 1024 / 1024).toFixed(1);
            toast.info(`Compressed ${file.name}: ${originalSize}MB → ${compressedSize}MB`);
          } catch (compressionError) {
            console.error('Compression failed for', file.name, compressionError);
            toast.warning(`Could not compress ${file.name}, using original file`);
            processedFile = file;
          }
        }

        processedFiles.push(processedFile);
        newImageUrls.push(URL.createObjectURL(processedFile));
      }

      if (processedFiles.length === 0) {
        toast.error("No valid images to upload");
        return;
      }

      updatedNutrition[index] = {
        ...updatedNutrition[index],
        images: [...(updatedNutrition[index].images || []), ...newImageUrls],
      };

      // Store the actual compressed file objects
      setImageFiles(prev => ({
        ...prev,
        [index]: [...(prev[index] || []), ...processedFiles]
      }));

      setValue("nutrition", updatedNutrition, { shouldValidate: true, shouldDirty: true });
      toast.success(`${processedFiles.length} image(s) processed and uploaded successfully!`);
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Failed to process images');
    } finally {
      setUploadingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  const analyzeImages = async (index) => {
    // Check for valid selectedDate
    if (!formData.selectedDate) {
      toast.error("Please select a check-in date before analyzing food images.");
      return;
    }
    const filesToAnalyze = imageFiles[index];
    const currentNutrition = getValues("nutrition");
    const currentItem = currentNutrition[index];
    
    console.log('Analyze Images Debug:', {
      index,
      filesToAnalyze,
      currentItem,
      imageFiles: imageFiles,
      hasImages: currentItem?.images?.length > 0
    });
    
    if (!filesToAnalyze || filesToAnalyze.length === 0) {
      // Fallback: check if there are images in the nutrition data
      if (currentItem?.images && currentItem.images.length > 0) {
        toast.error('Images are uploaded but file references are missing. Please re-upload the images.');
        return;
      }
      toast.error('No images to analyze. Please upload images first.');
      return;
    }

    setAnalyzingImages(prev => ({ ...prev, [index]: true }));
    const current = formData.selectedDate;
    try {
      const formData = new FormData();
      filesToAnalyze.forEach(file => {
        formData.append('images', file);
      });
      formData.append('current', current);
      formData.append('index',index);

      const response = await fetch('/api/client/analyze-food-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze images');

      const result = await response.json();
      
      const updatedNutrition = [...currentNutrition];
      updatedNutrition[index] = {
        ...updatedNutrition[index],
        protein: result.proteinList || "",
        proteinPortion: String(result.protein || 0),
        vegetables: result.vegetablesList || "",
        vegetablesPortion: String(result.vegetables || 0),
        carbs: result.carbsList || "",
        carbsPortion: String(result.carbs || 0),
        fats: result.fatList || "",
        fatsPortion: String(result.fat || 0),
        fruit: result.fruitList || "",
        fruitPortion: String(result.fruit || 0),
        other: result.otherList || "",
        otherPortion: String(result.other || 0),
      };

      setValue("nutrition", updatedNutrition, { shouldValidate: true, shouldDirty: true });
      toast.success("Food analysis completed successfully!");
    } catch (error) {
      console.error('Error analyzing images:', error);
      toast.error('Failed to analyze images');
    } finally {
      setAnalyzingImages(prev => ({ ...prev, [index]: false }));
    }
  };

  const removeImage = (nutritionIndex, imageIndex) => {
    const currentNutrition = getValues("nutrition");
    const updatedNutrition = [...currentNutrition];
    updatedNutrition[nutritionIndex].images.splice(imageIndex, 1);
    
    // Also remove from our file state
    const updatedImageFiles = {...imageFiles};
    if (updatedImageFiles[nutritionIndex]) {
      updatedImageFiles[nutritionIndex].splice(imageIndex, 1);
      setImageFiles(updatedImageFiles);
    }

    setValue("nutrition", updatedNutrition, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="space-y-6 px-2">
      {/* Meal count selector */}
      <div className="flex flex-col items-center mb-6">
        <h3 className="font-medium text-lg mb-3 text-center">How many meals do you want to log and analyze?</h3>
        <div
          className="flex flex-wrap gap-3 w-full justify-center mb-2 max-w-xs sm:max-w-lg"
          role="group"
          aria-label="Select number of meals to log"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Button
              key={num}
              type="button"
              size="lg"
              variant={mealCount === num ? "secondary" : "outline"}
              className={`transition-all duration-200 ease-in-out text-xl font-bold rounded-full w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] flex items-center justify-center shadow-md focus:ring-2 focus:ring-primary focus:outline-none
                ${mealCount === num ? "scale-110 ring-2 ring-primary bg-primary text-white" : "hover:bg-primary/10 hover:scale-105"}`}
              onClick={() => setMealCount(num)}
              aria-pressed={mealCount === num}
              aria-label={`Log ${num} meal${num > 1 ? 's' : ''}`}
            >
              {num}
            </Button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground mt-2">Tap a number to select</span>
      </div>
      {/* Render meal forms */}
      {(formData.nutrition || []).slice(0, mealCount).map((item, index) => (
        <div
          key={index}
          className="border rounded-lg p-4 mb-4 relative bg-white shadow-sm transition-all duration-300 animate-fade-in"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <div className="font-semibold text-base mb-3 text-primary flex items-center gap-2">
            <span className="inline-block rounded bg-primary/10 px-3 py-1">Meal {index + 1}</span>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => removeNutrition(index)}
            aria-label={`Remove meal ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          {/* Image Upload Section */}
          {
            planId==="pro"&&
          <div className="mb-4">
            <Label className="mb-2">Food Images</Label>
            <div className="mt-2">
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, index)}
                  className="hidden"
                  id={`food-images-${index}`}
                />
                <Label
                  htmlFor={`food-images-${index}`}
                  className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4" />
                  Upload Images
                </Label>
                {uploadingImages[index] && (
                  <span className="text-sm text-gray-500">Processing images...</span>
                )}
                {item.images && item.images.length > 0 && imageFiles[index] && imageFiles[index].length > 0 && (
                  <Button
                    type="button"
                    onClick={() => analyzeImages(index)}
                    disabled={analyzingImages[index] || !formData.selectedDate}
                    className="flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    {analyzingImages[index] ? 'Analyzing...' : 'Analyze Images'}
                  </Button>
                )}
              </div>
              
              {/* Image Preview Grid */}
              {item.images && item.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {item.images.map((imageUrl, imageIndex) => (
                    <div key={imageIndex} className="relative group">
                      <Image
                        src={imageUrl}
                        alt={`Food image ${imageIndex + 1}`}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index, imageIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          }

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2">Protein</Label>
              <Textarea
                {...register(`nutrition.${index}.protein`)}
                placeholder="What protein did you have?"
                className="mb-2"
              />
              <Input
                {...register(`nutrition.${index}.proteinPortion`)}
                type="number"
                step="0.01"
                placeholder="Portion (g)"
              />
            </div>

            <div>
              <Label className="mb-2">Fruits</Label>
              <Textarea
                {...register(`nutrition.${index}.fruit`)}
                placeholder="What fruits did you have? (e.g., apple, banana, orange)"
                className="mb-2"
              />
              <Input
                {...register(`nutrition.${index}.fruitPortion`)}
                type="number"
                step="0.01"
                placeholder="Portion (g)"
              />
            </div>

            <div>
              <Label className="mb-2">Vegetables</Label>
              <Textarea
                {...register(`nutrition.${index}.vegetables`)}
                placeholder="What vegetables did you have?"
                className="mb-2"
              />
              <Input
                {...register(`nutrition.${index}.vegetablesPortion`)}
                type="number"
                step="0.01"
                placeholder="Portion (g)"
              />
            </div>

            <div>
              <Label className="mb-2">Carbohydrates (Grains, Pasta, etc.)</Label>
              <Textarea
                {...register(`nutrition.${index}.carbs`)}
                placeholder="What carbohydrates did you have? (e.g., rice, bread, pasta)"
                className="mb-2"
              />
              <Input
                {...register(`nutrition.${index}.carbsPortion`)}
                type="number"
                step="0.01"
                placeholder="Portion (g)"
              />
            </div>

            <div>
              <Label className="mb-2">Fats</Label>
              <Textarea
                {...register(`nutrition.${index}.fats`)}
                placeholder="What fats did you have?"
                className="mb-2"
              />
              <Input
                {...register(`nutrition.${index}.fatsPortion`)}
                type="number"
                step="0.01"
                placeholder="Portion (g)"
              />
            </div>

            <div>
              <Label className="mb-2">Other</Label>
              <Textarea
                {...register(`nutrition.${index}.other`)}
                placeholder="Any other food items?"
                className="mb-2"
              />
              <Input
                {...register(`nutrition.${index}.otherPortion`)}
                type="number"
                step="0.01"
                placeholder="Portion (g)"
              />
            </div>

            {/* Calories Field */}
            <div>
              <Label className="mb-2">Calories</Label>
              <Input
                {...register(`nutrition.${index}.calories`)}
                type="number"
                step="0.01"
                placeholder="Calories"
                value={item.calories || ''}
                readOnly
                tabIndex={-1}
                style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NutritionTab;