import { GovernanceAreaProgress } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle, Clock, XCircle, DollarSign, Shield, Heart, Building, Zap, Users } from 'lucide-react';

interface GovernanceAreasGridProps {
  areas: GovernanceAreaProgress[];
}

export function GovernanceAreasGrid({ areas }: GovernanceAreasGridProps) {
  const router = useRouter();

  const getStatusIcon = (status: GovernanceAreaProgress['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'needs-rework':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'not-started':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: GovernanceAreaProgress['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'needs-rework':
        return 'text-red-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'not-started':
        return 'text-gray-600';
    }
  };

  const getAreaIcon = (areaName: string) => {
    const name = areaName.toLowerCase();
    if (name.includes('financial')) return <DollarSign className="h-5 w-5 text-green-600" />;
    if (name.includes('disaster')) return <Shield className="h-5 w-5 text-blue-600" />;
    if (name.includes('safety') || name.includes('peace')) return <AlertCircle className="h-5 w-5 text-orange-600" />;
    if (name.includes('social') || name.includes('protection')) return <Heart className="h-5 w-5 text-pink-600" />;
    if (name.includes('business') || name.includes('competitiveness')) return <Building className="h-5 w-5 text-purple-600" />;
    if (name.includes('environmental')) return <Zap className="h-5 w-5 text-green-600" />;
    return <Users className="h-5 w-5 text-gray-600" />;
  };

  const handleAreaClick = (areaId: string) => {
    router.push(`/blgu/assessments?area=${areaId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center">Assessment Areas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((area) => (
          <Card
            key={area.id}
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 hover:border-blue-300"
            onClick={() => handleAreaClick(area.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium line-clamp-2 flex items-start gap-2">
                {getAreaIcon(area.name)}
                <span className="flex-1">{area.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(area.status)}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(area.status)}`}
                  >
                    {area.current}/{area.total} Compliant
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(area.percentage)}%</span>
                </div>
                <Progress value={area.percentage} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}