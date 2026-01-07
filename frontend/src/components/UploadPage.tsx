import { useState, useRef, useEffect } from 'react';
import { Plus, Upload, FileSpreadsheet, Shield, Eye, AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { DashboardData } from '../types/dashboard';

interface UploadPageProps {
  onUploadComplete: (data: DashboardData) => void;
}

export function UploadPage({ onUploadComplete }: UploadPageProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carousel images - add your image URLs here
  const carouselImages = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop',
  ];

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError('Please select a valid Excel or CSV file (.xlsx, .xls, or .csv)');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Create FormData to send file
      const formData = new FormData();
      formData.append('file', file);

      // Send POST request to backend
      // Replace 'YOUR_BACKEND_URL' with your actual backend endpoint
      const response = await fetch('YOUR_BACKEND_URL/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Try to get error message from response
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Upload failed';
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON. Please check your backend URL.');
      }

      // If successful, call the callback to show overview
      const data: DashboardData = await response.json();
      onUploadComplete(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file. Please try again.';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl mb-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <Shield className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-gray-900 mb-6 text-5xl">RiskLens</h1>
          <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed mb-12">
            When responsibility rests on you, clarity matters more than data
          </p>

          {/* Carousel Section */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-100 to-slate-200">
              {/* Carousel Images */}
              <div className="relative w-full h-[400px]">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <img
                        src={image}
                        alt={`Dashboard preview ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Custom Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-blue-600 w-8'
                        : 'bg-blue-300 hover:bg-blue-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* Situation */}
          <section className="bg-white rounded-xl p-10 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h2 className="text-gray-900 mb-6 text-3xl">A situation many recognize</h2>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                If you've ever been responsible for a team, a system, or an organization, you know this feeling.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Everything appears normal—until it isn't.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Logs exist. Reports are stored. Spreadsheets are archived.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                But no one has time to truly understand them.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                The first issue is dismissed. The second becomes a warning.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                And then comes the realization most people don't talk about:
              </p>
              <p className="text-gray-900 font-medium text-lg bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                If this happens again, it won't be the system that's questioned. It will be my judgment.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                This is not about bad employees. It's about not seeing clearly, early enough.
              </p>
              <p className="text-gray-900 font-medium text-lg">
                That moment is where RiskLens belongs.
              </p>
            </div>
          </section>

          {/* The Real Problem */}
          <section className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-10 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
            <h2 className="text-gray-900 mb-6 text-3xl">The real problem</h2>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                Most organizations already collect employee activity data. What they lack is confidence in what it means.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Managers and employers are left asking:
              </p>
              <div className="space-y-3 my-6">
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <p className="text-gray-700 text-lg m-0">Is this normal or just noisy?</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <p className="text-gray-700 text-lg m-0">Does this deserve attention?</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <p className="text-gray-700 text-lg m-0">Am I reacting too much—or too late?</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                Raw logs don't answer these questions. They overwhelm them.
              </p>
              <p className="text-gray-900 font-medium text-lg">
                And when understanding lags behind reality, consequences follow.
              </p>
            </div>
          </section>

          {/* What RiskLens Changes */}
          <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-shadow duration-300 border-2 border-blue-200">
            <h2 className="text-gray-900 mb-6 text-3xl">What RiskLens changes</h2>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                RiskLens is built for people who carry responsibility.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                It transforms employee activity data into:
              </p>
              <div className="grid md:grid-cols-3 gap-6 my-8">
                <Card className="p-8 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-300">
                  <Eye className="h-10 w-10 text-blue-600 mb-4" />
                  <p className="text-gray-900 font-semibold mb-3 text-lg">Clear summary</p>
                  <p className="text-sm text-gray-600 leading-relaxed">A calm overview of what is happening</p>
                </Card>
                <Card className="p-8 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-indigo-300">
                  <AlertCircle className="h-10 w-10 text-indigo-600 mb-4" />
                  <p className="text-gray-900 font-semibold mb-3 text-lg">Highlighted signals</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Patterns that stand out</p>
                </Card>
                <Card className="p-8 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-300">
                  <CheckCircle className="h-10 w-10 text-blue-600 mb-4" />
                  <p className="text-gray-900 font-semibold mb-3 text-lg">Clear explanations</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Insights to guide decisions</p>
                </Card>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg italic">
                Not alarms. Not accusations. Not automation that removes human judgment.
              </p>
              <p className="text-gray-900 font-semibold text-xl bg-white p-4 rounded-lg text-center shadow-sm">
                Just clarity, when it matters.
              </p>
            </div>
          </section>

          {/* Comparison */}
          <section className="bg-white rounded-xl p-10 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h2 className="text-gray-900 mb-6 text-3xl">A simple comparison (this matters)</h2>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                To understand the difference RiskLens makes, consider two real-world scenarios.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                You can review both below:
              </p>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-8 border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-3xl mb-3">🔹</div>
                  <h3 className="text-gray-900 font-semibold mb-3 text-xl">Clean activity dataset</h3>
                  <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                    Represents routine, expected employee behavior over a normal reporting period.
                  </p>
                  <a 
                    href="https://risklensbackend-g8apbyf5dgceefbx.centralindia-01.azurewebsites.net/clean_dataset_page/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold underline hover:no-underline transition-all"
                  >
                    View clean dataset analysis →
                  </a>
                </Card>
                <Card className="p-8 border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-3xl mb-3">🔹</div>
                  <h3 className="text-gray-900 font-semibold mb-3 text-xl">Unusual activity dataset</h3>
                  <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                    Contains subtle patterns that may warrant review when seen in context.
                  </p>
                  <a 
                    href="https://risklensbackend-g8apbyf5dgceefbx.centralindia-01.azurewebsites.net/clean_dataset_page/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold underline hover:no-underline transition-all"
                  >
                    View unusual dataset analysis →
                  </a>
                </Card>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg mt-8">
                These datasets are analyzed using the same process. The difference lies in what becomes visible.
              </p>
              <p className="text-gray-600 text-base mt-4 italic">
                No uploads. No setup. Just outcomes.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-xl p-10 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h2 className="text-gray-900 mb-6 text-3xl">How it works (quietly and intentionally)</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-5 p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  1
                </div>
                <p className="text-gray-800 pt-2 text-lg">Activity data is analyzed</p>
              </div>
              <div className="flex items-start gap-5 p-5 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  2
                </div>
                <p className="text-gray-800 pt-2 text-lg">Patterns and deviations are identified</p>
              </div>
              <div className="flex items-start gap-5 p-5 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  3
                </div>
                <p className="text-gray-800 pt-2 text-lg">Key insights are summarized in a focused dashboard</p>
              </div>
              <div className="flex items-start gap-5 p-5 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  4
                </div>
                <p className="text-gray-800 pt-2 text-lg">A built-in assistant produces a readable, neutral report</p>
              </div>
            </div>
            <p className="text-gray-900 mt-8 text-lg font-medium text-center bg-gray-50 p-4 rounded-lg">
              The system doesn't demand attention. It earns it.
            </p>
          </section>

          {/* What You'll See */}
          <section className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-10 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
            <h2 className="text-gray-900 mb-6 text-3xl">What you'll see</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 text-lg">An overview of organizational activity</span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 text-lg">Patterns that differ meaningfully from the baseline</span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 text-lg">Employees whose activity may warrant review</span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 text-lg">Explanations written for people, not systems</span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow duration-200">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 text-lg">Reasonable next steps that respect context</span>
              </li>
            </ul>
            <p className="text-gray-900 font-semibold mt-8 text-xl text-center bg-white p-4 rounded-lg shadow-sm">
              The goal is not control. The goal is awareness.
            </p>
          </section>

          {/* What RiskLens Deliberately Avoids */}
          <section className="bg-white rounded-xl p-10 shadow-md hover:shadow-xl transition-shadow duration-300 border-l-8 border-indigo-600">
            <h2 className="text-gray-900 mb-6 text-3xl">What RiskLens deliberately avoids</h2>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              Because responsibility must be handled carefully, RiskLens has clear boundaries:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 text-lg">It does not assume intent</span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 text-lg">It does not take automated action on individuals</span>
              </li>
              <li className="flex items-start gap-4 p-4 bg-indigo-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-indigo-600 flex-shrink-0 mt-1" />
                <span className="text-gray-800 text-lg">It does not claim certainty when data is insufficient</span>
              </li>
            </ul>
            <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
              <p className="text-gray-700 text-lg mb-2">
                When something cannot be determined, it says so.
              </p>
              <p className="text-gray-900 font-semibold text-lg">
                That restraint is intentional.
              </p>
            </div>
          </section>

          {/* Why This Matters */}
          <section className="bg-white rounded-xl p-10 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h2 className="text-gray-900 mb-6 text-3xl">Why this matters</h2>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                Most serious organizational issues do not begin dramatically. They begin quietly, with signals no one had time to interpret.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                RiskLens helps organizations:
              </p>
              <div className="grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-gray-800 text-lg font-medium">Notice earlier</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-600">
                  <p className="text-gray-800 text-lg font-medium">Review calmly</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                  <p className="text-gray-800 text-lg font-medium">Act responsibly</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-gray-800 text-lg font-medium">Avoid learning only after consequences appear</p>
                </div>
              </div>
              <p className="text-gray-900 font-semibold text-xl text-center bg-gray-50 p-4 rounded-lg mt-8">
                It supports judgment instead of replacing it.
              </p>
            </div>
          </section>

          {/* Known Limitations */}
          <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-10 shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-amber-300">
            <h2 className="text-gray-900 mb-6 text-3xl">Known limitations</h2>
            <p className="text-gray-700 leading-relaxed text-lg bg-white p-6 rounded-lg shadow-sm">
              RiskLens depends on the scope and quality of available data. It does not provide real-time enforcement or infer intent beyond observable patterns. Its role is interpretation—not authority.
            </p>
          </section>

          {/* Designed to Grow */}
          <section className="bg-white rounded-xl p-10 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
            <h2 className="text-gray-900 mb-6 text-3xl">Designed to grow, carefully</h2>
            <div className="prose prose-gray max-w-none space-y-4">
              <p className="text-gray-700 leading-relaxed text-lg">
                RiskLens is intentionally scoped, but can be extended to:
              </p>
              <ul className="space-y-3 my-6">
                <li className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2.5"></div>
                  <span className="text-gray-800 text-lg">Compare activity across reporting periods</span>
                </li>
                <li className="flex items-start gap-3 bg-indigo-50 p-4 rounded-lg">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2.5"></div>
                  <span className="text-gray-800 text-lg">Align insights with internal policies</span>
                </li>
                <li className="flex items-start gap-3 bg-purple-50 p-4 rounded-lg">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2.5"></div>
                  <span className="text-gray-800 text-lg">Generate summaries more frequently when required</span>
                </li>
              </ul>
              <p className="text-gray-900 font-semibold text-xl text-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
                Every extension follows the same principle: Clarity first. Automation second.
              </p>
            </div>
          </section>

          {/* In One Line */}
          <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-12 shadow-2xl text-center transform hover:scale-[1.02] transition-transform duration-300">
            <p className="text-white text-2xl font-semibold leading-relaxed">
              RiskLens helps people with responsibility see clearly—before consequences force the issue.
            </p>
          </section>

          {/* Upload Section */}
          <section className="bg-white rounded-2xl p-12 shadow-2xl border-4 border-blue-300 hover:border-blue-400 transition-all duration-300">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl transform hover:rotate-6 transition-transform duration-300">
                <FileSpreadsheet className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-gray-900 mb-4 text-3xl">Get Started</h2>
              <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
                Upload your Excel or CSV report to analyze employee activity data and gain clarity
              </p>

              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <Button
                  size="lg"
                  onClick={handleButtonClick}
                  disabled={uploading}
                  className="gap-3 text-xl px-12 py-8 h-auto shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {uploading ? (
                    <>
                      <Upload className="h-6 w-6 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="h-6 w-6" />
                      New Report
                    </>
                  )}
                </Button>

                {error && (
                  <p className="text-sm text-red-600 mt-4 bg-red-50 p-3 rounded-lg">{error}</p>
                )}

                <div className="mt-10 pt-8 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4 font-medium">Supported file formats</p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold shadow-sm">
                      .xlsx
                    </span>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold shadow-sm">
                      .xls
                    </span>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold shadow-sm">
                      .csv
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    Grab sample datasets from{' '}
                    <a 
                      href="https://github.com/Aarav-Jain123/RiskLens/tree/main/datasets"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-semibold underline hover:no-underline transition-all"
                    >
                      github.com/Aarav-Jain123/RiskLens/datasets
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing */}
          <section className="text-center py-12">
            <p className="text-gray-800 text-2xl font-light italic">
              When understanding arrives early, action doesn't have to be reactive.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
