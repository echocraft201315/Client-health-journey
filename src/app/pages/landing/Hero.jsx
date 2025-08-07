import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { User, LogOut } from "lucide-react";
import { Shield, Brain, Users, Award, Play } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { useSession, signOut } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
const heroImage = "/assets/hero-healthcare.jpg";

const Hero = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const goDashboard = () => {
    if (session?.user?.role === "admin") {
      router.push("/admin/dashboard");
    } else if (session?.user?.role === "coach") {
      router.push("/coach/dashboard");
    } else if (session?.user?.role === "client") {
      router.push("/client/dashboard");
    } else if (session?.user?.role === "clinic_admin") {
      router.push("/clinic/dashboard");
    }
  }
  return (
    <section className="relative min-h-screen bg-gradient-medical flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in">
            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-primary-light text-primary border-primary/20 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                HIPAA Compliant
              </Badge>
              <Badge className="bg-secondary-light text-secondary border-secondary/20 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI-Powered
              </Badge>
              <Badge className="bg-accent-light text-accent1 border-accent1/20 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Trusted by Healthcare Professionals
              </Badge>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-hero leading-tight">
                AI-Powered Nutrition
                <span className="block text-gradient-hero">
                  Coaching for Healthcare
                </span>
                <span className="block">Providers</span>
              </h1>
              
              <p className="text-xl text-text-medical leading-relaxed max-w-2xl">
                Empower your practice with HIPAA-compliant, AI-driven weight loss and nutrition coaching. 
                Custom templates, automated food analysis, and personalized care for every patient.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {
                !session ? (
                  <Button
                    className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl h-12"
                    onClick={() => router.push("/login")}
                  >
                    Log In
                  </Button>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl flex items-center gap-2 h-12"
                      >
                        <User size={16} />
                        {session.user.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={goDashboard}>
                        <User size={16} />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => signOut()}>
                        <LogOut size={16} />
                        Log Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
              <Button 
                variant="medical" 
                className="w-full sm:w-auto px-8 py-3 text-base font-medium h-12 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
                onClick={() => window.open('https://go.clienthealthtracker.com/widget/booking/Fwe2aulhdV6W58wEhmQZ', '_blank')}
              >
                Schedule Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-8">
              <p className="text-sm text-text-medical mb-4">Trusted by healthcare professionals nationwide:</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-60">
                <div className="text-sm md:text-base font-semibold">Primary Care Physicians</div>
                <div className="text-sm md:text-base font-semibold">Registered Dietitians</div>
                <div className="text-sm md:text-base font-semibold">Wellness Centers</div>
                <div className="text-sm md:text-base font-semibold">Chiropractors</div>
                <div className="text-sm md:text-base font-semibold">Med Spas</div>
                <div className="text-sm md:text-base font-semibold">Health Coaches</div>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image/Video */}
          <div className="relative animate-slide-up">
            {/* Option 1: Video Player (uncomment when video URL is available) */}
            {/* <VideoPlayer 
              className="w-full"
              posterImage={heroImage}
              title="Client Health Tracker Demo"
              description="See our platform in action"
              autoplay={true}
              muted={true}
            /> */}
            
            {/* Option 2: Static Image with Video CTA (current default) */}
            <div className="relative">
              <img
                src={heroImage}
                alt="Healthcare provider using Client Health Tracker"
                className="w-full h-auto rounded-2xl shadow-elegant"
              />
                            
              {/* Floating cards */}
              <div className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-card animate-glow">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-sm font-medium">Patient Progress: +15%</span>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-card">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent1 rounded-full"></div>
                  <span className="text-sm font-medium">AI Insights: 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;