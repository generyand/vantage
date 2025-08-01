'use client';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface PredictionAccuracyData {
  accuracy: number;
  falsePositives: number;
  falseNegatives: number;
  totalPredictions: number;
}

interface DiscrepancyData {
  barangay: string;
  vantagePrediction: 'Pass' | 'Fail';
  officialResult: 'Pass' | 'Fail';
  supervisorRemarks: string;
}

interface CrossMatchingData {
  predictionAccuracy: PredictionAccuracyData;
  discrepancies: DiscrepancyData[];
}

interface CrossMatchingWidgetProps {
  data: CrossMatchingData;
}

export function CrossMatchingWidget({ data }: CrossMatchingWidgetProps) {
  const { predictionAccuracy, discrepancies } = data;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Pre-Assessment Effectiveness Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="accuracy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accuracy">Prediction Accuracy</TabsTrigger>
            <TabsTrigger value="discrepancies">Discrepancy Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="accuracy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Prediction Accuracy KPI */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {predictionAccuracy.accuracy}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Prediction Accuracy</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {predictionAccuracy.totalPredictions} total predictions
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* False Positives KPI */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {predictionAccuracy.falsePositives}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">False Positives</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Predicted Pass, Actually Failed
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* False Negatives KPI */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {predictionAccuracy.falseNegatives}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">False Negatives</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Predicted Fail, Actually Passed
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Accuracy Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Analysis Summary</h4>
              <p className="text-sm text-gray-600">
                The V-ANTAGE pre-assessment system achieved a {predictionAccuracy.accuracy}% accuracy rate, 
                with {predictionAccuracy.falsePositives} false positives and {predictionAccuracy.falseNegatives} false negatives. 
                This indicates the system&apos;s effectiveness in predicting SGLGB outcomes.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="discrepancies" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Discrepancies Found: {discrepancies.length}
                </h4>
                <p className="text-sm text-gray-600">
                  Barangays where pre-assessment results did not match official outcomes
                </p>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Barangay</TableHead>
                      <TableHead>V-ANTAGE Prediction</TableHead>
                      <TableHead>Official Result</TableHead>
                      <TableHead>Supervisor Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discrepancies.map((discrepancy, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {discrepancy.barangay}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={discrepancy.vantagePrediction === 'Pass' ? 'default' : 'destructive'}
                            className={discrepancy.vantagePrediction === 'Pass' ? 'bg-green-500' : 'bg-red-500'}
                          >
                            {discrepancy.vantagePrediction}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={discrepancy.officialResult === 'Pass' ? 'default' : 'destructive'}
                            className={discrepancy.officialResult === 'Pass' ? 'bg-green-500' : 'bg-red-500'}
                          >
                            {discrepancy.officialResult}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-gray-600 truncate" title={discrepancy.supervisorRemarks}>
                            {discrepancy.supervisorRemarks}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 