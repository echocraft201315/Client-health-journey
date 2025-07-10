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
import { useState,useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "../../components/ui/skeleton";

const ClientsPage = () => {
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);
  const { user } = useAuth();
  const isCoach = user?.role === "coach";
  const handleAddlclientdialogue = () => {
    setIsAddClientDialogOpen(true);
  };
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/client");
      const data = await response.json();
      setClients(data.clients);
    } catch (error) {
      toast.error("Failed to fetch clients");
      console.log(error);
    }
    setIsLoading(false);
  };
  console.log("clients", clients)

  useEffect(() => {
    fetchClients();
  }, []);
  return (
    <div className="px-2 sm:px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2 sm:gap-0">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex gap-2">
        <Button
            variant="outline"
            size="icon"
            className="flex items-center justify-center"
            title="Refresh clients"
            onClick={fetchClients}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
          {/* <Button onClick={handleAddlclientdialogue}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
          </Button> */}
        </div>
      </div>

      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>{isCoach ? "Your Clients" : "All Clients"}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <>
          {isCoach ? <CoachClientList /> : <ClientList clients={clients} />}
          </>
          )}  
        </CardContent>
      </Card>

      <AddClientDialog open={isAddClientDialogOpen} />
    </div>
  );
};

export default ClientsPage;
