import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import AddHotHoldingDialog from "@/components/AddHotHoldingDialog";

interface HotHoldingRecord {
  id: string;
  foodItem: string;
  timeIntoHotHold: string;
  coreTemperature: number;
  checkedBy: string;
  comments?: string;
  createdAt: string;
}

const HotHolding = () => {
  const [records, setRecords] = useState<HotHoldingRecord[]>([]);

  const loadData = () => {
    const stored = JSON.parse(localStorage.getItem("hotHoldingRecords") || "[]");
    setRecords(stored.sort((a: HotHoldingRecord, b: HotHoldingRecord) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Hot Holding</h1>
            <p className="text-gray-600">Monitor hot holding temperatures (FSAI SC4)</p>
          </div>
          <AddHotHoldingDialog onRecordAdded={loadData} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hot Holding Records</CardTitle>
            <CardDescription>Core temperature must be ≥63°C. Check every 90 minutes.</CardDescription>
          </CardHeader>
          <CardContent>
            {records.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No hot holding records yet</p>
                <p className="text-sm mt-2">Log your first hot holding temperature check</p>
              </div>
            ) : (
              <div className="space-y-2">
                {records.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{record.foodItem}</div>
                      <div className="text-sm text-gray-600">
                        Time: {record.timeIntoHotHold} | Checked by {record.checkedBy}
                      </div>
                      {record.comments && (
                        <div className="text-sm text-gray-500 mt-1">{record.comments}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(record.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{record.coreTemperature}°C</span>
                      <Badge className={record.coreTemperature >= 63 ? "bg-success-green" : "bg-danger-red"}>
                        {record.coreTemperature >= 63 ? "SAFE" : "UNSAFE"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HotHolding;