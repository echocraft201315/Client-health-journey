"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { UserPlus, AlertCircle, RefreshCw } from "lucide-react";
import ClientList from "../../components/clients/ClientList";
import CoachClientList from "../../components/clients/CoachClientList";
import AddClientDialog from "../../components/clients/AddClientDialog";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";

const ClientsPage = () => {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientLimit, setClientLimit] = useState(0);
  const { user } = useAuth();
  const controls = useAnimation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleAddlclientdialogue = () => {
    if (
      clientLimit !== false &&
      (clientLimit === 0 || clientLimit <= clients.length)
    ) {
      toast.custom(() => (
        <Alert>
          <AlertTitle>
            You have reached the maximum number of clients
          </AlertTitle>
          <AlertDescription>
            You have reached the maximum number of clients for your plan. Please
            upgrade to a higher plan to add more clients.
          </AlertDescription>
          <Button
            variant="outline"
            onClick={() => router.push("/clinic/settings")}
          >
            Upgrade
          </Button>
        </Alert>
      ));
      return;
    }
    setIsAddClientDialogOpen(true);
  };

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/coach/client");
      const data = await response.json();
      console.log("clients", data);
      setClients(data.clients);
      setClientLimit(data.clientLimit);
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to fetch clients");
      console.log(error);
    }
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const handleRefresh = () => {
    controls
      .start({
        rotate: 360,
        transition: { duration: 0.8, ease: "linear" },
      })
      .then(() => controls.set({ rotate: 0 }));
    fetchClients();
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 sm:gap-0">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleRefresh}>
            <motion.svg
              animate={controls}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              style={{ display: "inline-block", verticalAlign: "middle" }}
            >
              {/* Icon path here */}
              <RefreshCw className="mr-2 h-4 w-4" />
            </motion.svg>
            Refresh
          </Button>
          <Button onClick={handleAddlclientdialogue} disabled={isLoading}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>
      <Alert className="mb-6 bg-primary-50 border-primary-200">
        <AlertCircle className="h-4 w-4 text-primary" />
        <AlertTitle>Coach View</AlertTitle>
        <AlertDescription>
          You are viewing all clients for {user?.name || "your clinic"}. This
          includes clients assigned to all coaches in your clinic.
        </AlertDescription>
      </Alert>
      <Card className="w-full overflow-x-auto">
        <CardHeader>
          <CardTitle>Your Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <CoachClientList clients={clients} fetchClients={fetchClients} />
        </CardContent>
      </Card>
      <AddClientDialog
        open={isAddClientDialogOpen}
        onOpenChange={setIsAddClientDialogOpen}
        fetchClients={fetchClients}
        clientLimit={clientLimit}
        clientCount={clients?.length}
      />
    </div>
  );
};

export default ClientsPage;
