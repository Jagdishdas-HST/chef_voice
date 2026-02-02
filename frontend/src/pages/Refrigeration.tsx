import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, MapPin, Trash2 } from "lucide-react";
import AddRefrigerationUnitDialog from "@/components/AddRefrigerationUnitDialog";
import LogTemperatureDialog from "@/components/LogTemperatureDialog";
import { Button } from "@/components/ui/button";
import { useRefrigerationUnits, useTemperatureLogs, useDeleteRefrigerationUnit } from "@/hooks/useRefrigeration";

const Refrigeration = () => {
  const { data: units = [], refetch: refetchUnits } = useRefrigerationUnits();
  const { data: logs = [], refetch: refetchLogs } = useTemperatureLogs();
  const deleteUnit = useDeleteRefrigerationUnit();

  const getLatestLog = (unitId: string) => {
    const unitLogs = logs.filter((log: any) => log.unitId === unitId);
    return unitLogs.sort((a: any, b: any) => new Date(b.readingTime).getTime() - new Date(a.readingTime).getTime())[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok": return "bg-success-green";
      case "warning": return "bg-warning-yellow";
      case "critical": return "bg-danger-red";
      default: return "bg-gray-500";
    }
  };

  const handleDelete = async (unitId: string) => {
    await deleteUnit.mutateAsync(unitId);
    refetchUnits();
  };

  const handleUnitAdded = () => {
    refetchUnits();
  };

  const handleLogAdded = () => {
    refetchLogs();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Refrigeration Monitoring</h1>
            <p className="text-gray-600">Track fridge and freezer temperatures (FSAI SC2)</p>
          </div>
          <AddRefrigerationUnitDialog onUnitAdded={handleUnitAdded} />
        </div>

        {units.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Temperature Monitoring Units</CardTitle>
              <CardDescription>Manage your refrigeration units and log temperatures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Thermometer className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No refrigeration units added yet</p>
                <p className="text-sm mt-2">Click "Add Unit" to create your first monitoring unit</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {units.map((unit: any) => {
              const latestLog = getLatestLog(unit.id);
              return (
                <Card key={unit.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{unit.fridgeNumber}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {unit.location}
                        </CardDescription>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(unit.id)}
                      >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                    <Badge variant="outline" className="w-fit mt-2">
                      {unit.type}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target:</span>
                      <span className="font-semibold">{unit.targetTemperature}°C</span>
                    </div>
                    
                    {latestLog ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Current:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{latestLog.temperature}°C</span>
                            <Badge className={getStatusColor(latestLog.status)}>
                              {latestLog.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Last checked: {new Date(latestLog.readingTime).toLocaleString()}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 italic">No readings yet</div>
                    )}

                    <LogTemperatureDialog unit={unit} onLogAdded={handleLogAdded} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Temperature Logs</CardTitle>
              <CardDescription>All temperature readings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {logs
                  .sort((a: any, b: any) => new Date(b.readingTime).getTime() - new Date(a.readingTime).getTime())
                  .slice(0, 10)
                  .map((log: any) => {
                    const unit = units.find((u: any) => u.id === log.unitId);
                    return (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{unit?.fridgeNumber || "Unknown Unit"}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(log.readingTime).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg">{log.temperature}°C</span>
                          <Badge className={getStatusColor(log.status)}>
                            {log.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Refrigeration;