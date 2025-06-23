import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, X, FileImage, AlertCircle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface UploadAreaProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function UploadArea({ onFileUpload, isLoading = false, disabled = false }: UploadAreaProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [hasCamera, setHasCamera] = useState(false);

  // Check if device has camera capabilities
  useEffect(() => {
    if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const hasVideoInput = devices.some(device => device.kind === 'videoinput');
          setHasCamera(hasVideoInput);
        })
        .catch(() => {
          setHasCamera(false);
        });
    }
  }, [isMobile]);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, WebP).",
        variant: "destructive",
      });
      return false;
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleUploadClick = () => {
    if (disabled) {
      toast({
        title: "Upload Disabled",
        description: "You've reached your upload limit for this month.",
        variant: "destructive",
      });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    if (disabled) {
      toast({
        title: "Upload Disabled",
        description: "You've reached your upload limit for this month.",
        variant: "destructive",
      });
      return;
    }
    cameraInputRef.current?.click();
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getSupportedFormats = () => {
    return ["JPG", "PNG", "WebP"];
  };

  if (selectedFile && previewUrl) {
    return (
      <div className="space-y-6">
        {/* File Preview */}
        <div className="relative">
          <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
            <div className="flex items-start space-x-4">
              <div className="relative flex-shrink-0">
                <img 
                  src={previewUrl} 
                  alt="Wine bottle preview" 
                  className="w-32 h-40 object-cover rounded-lg border border-gray-200"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white rounded-full hover:bg-red-600"
                  disabled={isLoading}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate mb-1">Selected Wine Photo</h4>
                <p className="text-sm text-gray-600 mb-2">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mb-4">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FileImage className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Ready for Analysis</p>
                      <p className="text-xs text-blue-700">
                        Our AI will identify the wine and provide detailed analysis including optimal drinking windows.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button 
            onClick={handleAnalyze}
            disabled={isLoading}
            className="flex-1 bg-grape text-white hover:bg-purple-800"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full" />
                Analyzing Wine...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Analyze This Wine
              </>
            )}
          </Button>
          <Button 
            onClick={handleRemoveFile}
            variant="outline"
            disabled={isLoading}
            className="border-gray-300 hover:bg-gray-50"
          >
            Choose Different Photo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200
          ${disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : dragActive 
              ? 'border-grape bg-purple-50' 
              : 'border-gray-300 hover:border-grape hover:bg-gray-50'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        {/* Camera input for mobile */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {disabled ? (
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        ) : (
          <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${dragActive ? 'text-grape' : 'text-gray-400'}`} />
        )}
        
        <h3 className={`text-lg font-semibold mb-2 ${disabled ? 'text-gray-400' : 'text-slate'}`}>
          {disabled ? 'Upload Limit Reached' : 'Upload Wine Photos'}
        </h3>
        
        <p className={`mb-4 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {disabled 
            ? 'Upgrade to Premium for unlimited uploads' 
            : isMobile && hasCamera
              ? 'Drag and drop images, choose files, or take a photo'
              : 'Drag and drop wine bottle images or click to browse'
          }
        </p>
        
        {!disabled && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleUploadClick}
              className="bg-grape text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-800 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            
            {isMobile && hasCamera && (
              <Button 
                onClick={handleCameraClick}
                variant="outline"
                className="border-grape text-grape px-6 py-3 rounded-lg font-medium hover:bg-grape hover:text-white transition-colors"
              >
                <Camera className="w-4 h-4 mr-2" />
                Take Photo
              </Button>
            )}
          </div>
        )}
        
        <p className={`text-xs mt-2 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
          Supports {getSupportedFormats().join(', ')} up to 10MB each
        </p>
      </div>

      {/* Upload Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Image className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Tips for Best Results</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure the wine label is clearly visible and well-lit</li>
              <li>• Avoid shadows or reflections on the bottle</li>
              <li>• Include the full bottle in the frame</li>
              <li>• For vintage wines, capture any vintage year markings</li>
              {isMobile && hasCamera && (
                <li>• When using camera, hold steady and tap to focus on the label</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
