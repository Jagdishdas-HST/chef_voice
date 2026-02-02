import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Info } from "lucide-react";
import AddDeliveryDialog from "@/components/AddDeliveryDialog";
import { useDeliveries } from "@/hooks/useDeliveries";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Delivery = () => {
  const { data: deliveries = [], refetch } = useDeliveries();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frozen": return "bg-info-blue";
      case "Chilled": return "bg-success-green";
      case "Ambient": return "bg-warning-yellow";
      default: return "bg-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Delivery Logging</h1>
            <p className="text-gray-600">Record deliveries with voice or OCR (FSAI SC1)</p>
          </div>
          <AddDeliveryDialog onDeliveryAdded={refetch} />
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>OCR:</strong> Click "Scan Invoice" to upload an invoice image. The system will extract supplier, products, and batch numbers.<br/>
            <strong>Voice:</strong> Click "Voice Log" and say: "Supplier is [name], received by [staff], product [name] [quantity] [temperature] batch [number]"
          </AlertDescription>
        </Alert>

        {deliveries.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>View and manage delivery records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No deliveries logged yet</p>
                <p className="text-sm mt-2">Use voice, OCR, or manual entry to log your first delivery</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {deliveries.map((delivery: any) => (
              <Card key={delivery.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{delivery.supplier}</CardTitle>
                      <CardDescription>
                        Received by {delivery.staffMember} on {new Date(delivery.deliveryDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{delivery.products.length} items</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {delivery.products.map((product: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-600">
                            Batch: {product.batchNumber} | Qty: {product.quantity || "N/A"}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {product.temperature && (
                            <span className="text-sm font-medium">{product.temperature}°C</span>
                          )}
                          <Badge className={getCategoryColor(product.category)}>
                            {product.category}
                          </Badge>
                          <Badge variant={product.quality === "Good" ? "default" : product.quality === "Acceptable" ? "secondary" : "destructive"}>
                            {product.quality}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Delivery;