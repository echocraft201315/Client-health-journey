import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import ProgramOverviewTab from '../../components/programs/tabs/ProgramOverviewTab';
import GuidelinesTab from '../../components/programs/tabs/GuidelinesTab';
import SupplementsTab from '../../components/programs/tabs/SupplementsTab';

const ProgramDetailsContent = () => {
  const loading = false;
  const programType = "practice_naturals";
  const programCategory = "B"
  const supplements = [
    {
      id:"1",
      name:"aaa",
      description:"adsfasdfasdf",
      dosage:23,
      frequency:3,
      timeofDay:3,
    },
    {
      id:"2",
      name:"aaaddf",
      description:"adfdfdsfasdfasdf",
      dosage:21,
      frequency:4,
      timeofDay:2,
    },
  ]
  return (
    <div className="space-y-6 px-2 sm:px-4 md:px-6 py-4 w-full max-w-3xl mx-auto">
      <Tabs defaultValue="overview">
        <TabsList className="flex flex-wrap gap-2 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6 w-full">
          <ProgramOverviewTab />
        </TabsContent>
        <TabsContent value="guidelines" className="w-full">
          <GuidelinesTab 
            loading={loading} 
            programType={programType} 
            programCategory={programCategory} 
          />
        </TabsContent>
        <TabsContent value="supplements" className="w-full">
          <SupplementsTab 
            supplements={supplements} 
            programType={programType} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgramDetailsContent;
