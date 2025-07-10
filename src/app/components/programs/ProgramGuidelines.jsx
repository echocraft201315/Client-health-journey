import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import ChiroThinGuidelines from './guidelines/ChiroThinGuidelines';
import PracticeNaturalsGuidelines from './guidelines/PracticeNaturalsGuidelines';
import GeneralGuidelines from './guidelines/GeneralGuidelines';

const ProgramGuidelines = ({ programType, programCategory }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Guidelines</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {programType === 'practice_naturals' && (
          <PracticeNaturalsGuidelines category={programCategory} />
        )}
        
        {programType === 'chirothin' && (
          <ChiroThinGuidelines />
        )}
        
        <Separator className="my-4" />
        
        <GeneralGuidelines />
      </CardContent>
    </Card>
  );
};

export default ProgramGuidelines;
