"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Building, Info } from 'lucide-react';
import { CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import ClinicInformationTab from './ClinicInformationTab';
import CoachSetupTab from './CoachSetupTab';
import AccountSetupTab from './AccountSetupTab';
import { clinicSignupSchema, planOptions } from './types';
import { SubscriptionPlan } from '../../lib/stack';

const ClinicSignupForm = ({ isSubmitting, onSubmit }) => {
  const [activeTab, setActiveTab] = React.useState('clinic');
  const [additionalCoaches, setAdditionalCoaches] = React.useState([]);
  const [createAccount, setCreateAccount] = React.useState(true);

  const form = useForm({
    resolver: zodResolver(clinicSignupSchema),
    defaultValues: {
      clinicName: '',
      clinicEmail: '',
      clinicPhone: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      primaryContact: '',
      email: '',
      password: '',
      confirmPassword: '',
      hipaaAcknowledgment: false,
      legalAcknowledgment: false,
      selectedPlan: SubscriptionPlan[0].id,
      addOns: [],
    },
    mode: 'onChange'
  });

  // Calculate progress based on active tab
  const getProgress = () => {
    switch (activeTab) {
      case 'clinic':
        return 33;
      case 'coaches':
        return 66;
      case 'account':
        return 100;
      default:
        return 0;
    }
  };

  // Load saved form data on mount
  // React.useEffect(() => {
  //   const savedData = localStorage.getItem('clinicSignupForm');
  //   if (savedData) {
  //     try {
  //       const parsedData = JSON.parse(savedData);
  //       setFormData(parsedData);
  //       form.reset(parsedData);
  //       setAdditionalCoaches(parsedData.additionalCoaches || []);
  //     } catch (error) {
  //       console.error('Error loading saved form data:', error);
  //       localStorage.removeItem('clinicSignupForm');
  //     }
  //   }
  // }, [form]);

  // Auto-save form data
  // React.useEffect(() => {
  //   const saveFormData = () => {
  //     const formValues = form.getValues();
  //     setFormData({ ...formValues, additionalCoaches });
  //     localStorage.setItem('clinicSignupForm', JSON.stringify({ ...formValues, additionalCoaches }));
  //   };

  //   const interval = setInterval(saveFormData, 30000); // Auto-save every 30 seconds
  //   return () => clearInterval(interval);
  // }, [form, additionalCoaches]);

  const handleSubmit = async (values) => {
    await onSubmit(values, additionalCoaches);
  };

  const addCoach = () => {
    setAdditionalCoaches([...additionalCoaches, { name: '', email: '', phone: '' }]);
  };

  const removeCoach = (index) => {
    const updatedCoaches = [...additionalCoaches];
    updatedCoaches.splice(index, 1);
    setAdditionalCoaches(updatedCoaches);
  };

  const updateCoach = (index, field, value) => {
    const updatedCoaches = [...additionalCoaches];
    updatedCoaches[index][field] = value;
    setAdditionalCoaches(updatedCoaches);
  };

  return (
    <>
      <CardHeader>
        <div className="flex items-center">
          <Building className="mr-2 h-6 w-6 text-primary" />
          <CardTitle>Clinic Signup</CardTitle>
        </div>
        <CardDescription>
          Register your clinic and create your account to get started
        </CardDescription>
      </CardHeader>

      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{getProgress()}%</span>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="clinic">
                  <div className="flex items-center gap-2">
                    Clinic Information
                    {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter your clinic's basic information</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="coaches">
                  <div className="flex items-center gap-2">
                    Coach Setup
                    {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add coaches to your clinic</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="account">
                  <div className="flex items-center gap-2">
                    Account & Plan
                    {/* <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Choose your plan and create your account</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="space-y-4 mt-4">
              <TabsContent value="clinic">
                <ClinicInformationTab 
                  form={form} 
                  onNext={() => setActiveTab('coaches')} 
                />
              </TabsContent>

              <TabsContent value="coaches">
                <CoachSetupTab 
                  form={form}
                  additionalCoaches={additionalCoaches}
                  onAddCoach={addCoach}
                  onRemoveCoach={removeCoach}
                  onUpdateCoach={updateCoach}
                  onBack={() => setActiveTab('clinic')}
                  onNext={() => setActiveTab('account')}
                />
              </TabsContent>

              <TabsContent value="account">
                <AccountSetupTab 
                  form={form}
                  createAccount={createAccount}
                  onToggleCreateAccount={setCreateAccount}
                  onBack={() => setActiveTab('coaches')}
                  isSubmitting={isSubmitting}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </form>
      </Form>
    </>
  );
};

export default ClinicSignupForm;
