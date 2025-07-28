"use client";
import React from "react";
import { Button } from "../components/ui/button";
import Link from "next/link";
import {
  Weight,
  Pill,
  CheckCircle,
  LineChart,
  ArrowRight,
  Building,
  User,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DemoLoginButtons from "../auth/signup/DemoLoginButtons";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const LandingPage = () => {
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-50 via-primary-100 to-secondary-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-12 sm:py-20 md:py-24 lg:py-32 lg:max-w-2xl lg:w-full">
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-block bg-primary-100/20 px-4 py-2 rounded-full text-primary-600 font-medium text-sm mb-4">
                🚀 New Features Available
              </div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block sm:whitespace-nowrap animate-fade-in">
                  Wellness and Nutrition
                </span>
                <span className="block text-primary-500 animate-fade-in-delayed">
                  Tracking Platform
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto lg:mx-0 leading-relaxed">
                A comprehensive platform for healthcare providers, coaches, and
                clients to track progress, manage wellness programs, and achieve
                health goals.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-x-4 space-y-2">
                {
                  !session ? (
                    <Button
                      className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>) :
                    (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="w-full sm:w-auto px-8 py-3 text-base font-medium bg-primary-600 hover:bg-primary-700 text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
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
                            Sign Out
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                }
                <Button
                  asChild
                  variant="secondary"
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <a href="#features">Learn More</a>
                </Button>
                {/* <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium text-primary-600 bg-transparent hover:bg-primary-50 border border-primary-200 hover:border-primary-300 transform hover:scale-105 transition-all duration-200"
                >
                  <Link href="/clinicRegister" className="flex items-center">
                    <Building size={16} className="mr-2" />
                    Register your clinic
                  </Link>
                </Button> */}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="relative h-full">
            <div className="absolute inset-0 bg-gradient-to-l from-primary-50/50 to-transparent z-10"></div>
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full transform hover:scale-105 transition-transform duration-700"
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              alt="Health tracking"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Weight className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600 ">
                Track weight, measurements, energy levels, and more with visual
                charts.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Pill className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Supplement Management
              </h3>
              <p className="text-gray-600">
                Assign supplements and track adherence for optimal results.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Daily Check-ins</h3>
              <p className="text-gray-600">
                Simple check-in forms for clients to consistently track their
                journey.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 text-left">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Reports</h3>
              <p className="text-gray-600">
                Generate comprehensive reports to visualize client progress over
                time.
              </p>
            </div>
          </div>

          {/* <div className="mt-12 text-center">
            <Link href="/clinicRegister">
              <Button size="lg" className="gap-2">
                Register Your Clinic <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div> */}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <div className="flex items-center mb-4 md:mb-0">
            <Weight className="h-6 w-6 text-primary-400 mr-2" />
            <span className="font-bold text-white">Client Health Tracker™</span>
          </div>
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Client Health Tracker™. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
