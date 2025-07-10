'use client'

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutForm />
        </Suspense>
    );
}

function CheckoutForm() {
    const searchParams = useSearchParams();
    const status = searchParams.get("status");
    const sessionId = searchParams.get("session_id");
    const [session, setSession] = useState(null);
    const [error, setError] = useState(null);
    const { data: sessionData } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await fetch(`/api/checkout/session/${sessionId}`);
                const data = await response.json();
                setSession(data);
            } catch (error) {
                setError(error);
            }
        };
        const deleteSession = async () => {
            try {
                await fetch(`/api/checkout/session`, { method: "DELETE" });
            } catch (error) {
                setError(error);
            }
        };
        if (status === "success" && sessionId) {
            fetchSession();
        } else if (status === "canceled") {
            deleteSession();
            setError("Payment canceled");
        }
    }, [sessionId, status]);

    const goToDashboard = () => {
        if (sessionData?.user?.role === "admin") {
            router.push("/admin/dashboard");
        } else if (sessionData?.user?.role === "coach") {
            router.push("/coach/dashboard");
        } else if (sessionData?.user?.role === "client") {
            router.push("/client/dashboard");
        } else if (session?.user?.role === "clinic_admin") {
            router.push("/clinic/dashboard");
        } else {
            router.push("/login");
        }
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Payment Failed</h2>
                    <p className="text-gray-600 text-center mb-6">{error.message || "Your payment was canceled. Please try again."}</p>
                    <div className="flex justify-center">
                        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Payment Successful!</h2>
                <div className="space-y-4">
                    <div className="border-t border-b border-gray-200 py-4">
                        <p className="text-sm text-gray-600">Amount Paid</p>
                        <p className="text-lg font-semibold text-gray-900">
                            ${session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00'} {session.currency?.toUpperCase()}
                        </p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="text-lg font-semibold text-gray-900 capitalize">
                            {session.payment_method_types?.[0]?.replace('_', ' ') || 'Card'}
                        </p>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-lg font-semibold text-gray-900">{session.customer_details?.email || 'N/A'}</p>
                    </div>
                </div>
                <div className="mt-8 flex justify-center">
                    <Button onClick={goToDashboard}>
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
