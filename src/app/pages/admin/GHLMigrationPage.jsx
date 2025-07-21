"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";
import { Loader2, RefreshCw, ArrowRight, CheckCircle, XCircle } from "lucide-react";

const GHLMigrationPage = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/migrate-to-ghl');
      const data = await response.json();
      
      if (data.success) {
        setClinics(data.clinics);
      } else {
        toast.error('Failed to fetch clinics');
      }
    } catch (error) {
      console.error('Error fetching clinics:', error);
      toast.error('Error fetching clinics');
    } finally {
      setLoading(false);
    }
  };

  const migrateClinic = async (clinicId) => {
    try {
      setMigrating(true);
      const response = await fetch('/api/migrate-to-ghl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clinicId,
          action: 'migrate'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`Successfully migrated ${data.clinic.name}`);
        fetchClinics(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to migrate clinic');
      }
    } catch (error) {
      console.error('Error migrating clinic:', error);
      toast.error('Error migrating clinic');
    } finally {
      setMigrating(false);
    }
  };

  const bulkMigrate = async () => {
    try {
      setMigrating(true);
      const response = await fetch('/api/migrate-to-ghl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bulk-migrate'
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Bulk migration completed');
        fetchClinics(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to perform bulk migration');
      }
    } catch (error) {
      console.error('Error in bulk migration:', error);
      toast.error('Error in bulk migration');
    } finally {
      setMigrating(false);
    }
  };

  const getStatusBadge = (clinic) => {
    if (!clinic.subscriptionProvider || clinic.subscriptionProvider === 'none') {
      return <Badge variant="secondary">No Subscription</Badge>;
    }
    
    if (clinic.subscriptionProvider === 'ghl') {
      return <Badge variant="success" className="bg-green-100 text-green-800">GHL</Badge>;
    }
    
    return <Badge variant="secondary">{clinic.subscriptionProvider}</Badge>;
  };

  const getActionButton = (clinic) => {
    if (clinic.subscriptionProvider === 'ghl') {
      return (
        <Button size="sm" variant="outline" disabled>
          <CheckCircle className="h-4 w-4 mr-2" />
          Active
        </Button>
      );
    }
    
    if (clinic.subscriptionProvider === 'none') {
      return (
        <Button 
          size="sm" 
          onClick={() => migrateClinic(clinic.clinicId)}
          disabled={migrating}
        >
          {migrating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}
          Setup GHL
        </Button>
      );
    }
    
    return null;
  };

  return (
    <div className="px-2 sm:px-4 md:px-6 py-4 w-full max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">GHL Subscription Management</h1>
        <p className="text-gray-500">Manage GoHighLevel subscriptions for all clinics</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={fetchClinics} 
          disabled={loading}
          variant="outline"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
        
        <Button 
          onClick={bulkMigrate} 
          disabled={migrating || clinics.filter(c => c.subscriptionProvider === 'none').length === 0}
          variant="default"
        >
          {migrating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4 mr-2" />
          )}
          Setup GHL for All Clinics
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinic Migration Status</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Clinic</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Provider</th>
                    <th className="text-left py-3 px-4 font-medium">Plan</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">GHL Contact</th>
                    <th className="text-left py-3 px-4 font-medium">GHL Subscription</th>
                    <th className="text-left py-3 px-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clinics.map((clinic) => (
                    <tr key={clinic.clinicId} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{clinic.clinicName}</td>
                      <td className="py-3 px-4">{clinic.clinicEmail}</td>
                      <td className="py-3 px-4">{getStatusBadge(clinic)}</td>
                      <td className="py-3 px-4">
                        {clinic.planId ? (
                          <Badge variant="outline">{clinic.planId}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {clinic.isActive ? (
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {clinic.hasGHLContact ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {clinic.hasGHLSubscription ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {getActionButton(clinic)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {clinics.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No clinics found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">GHL Setup Notes:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Clinics without subscriptions will be set up with GHL contacts</li>
          <li>• GHL subscription records will be created for each clinic</li>
          <li>• Webhooks will sync subscription status changes from GHL</li>
          <li>• You can setup individual clinics or use bulk setup for all</li>
          <li>• All new clinics will automatically use GHL subscriptions</li>
        </ul>
      </div>
    </div>
  );
};

export default GHLMigrationPage; 