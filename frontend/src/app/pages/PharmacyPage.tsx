import { useState } from "react";
import { Link } from "react-router";
import { 
  Activity, 
  ChevronDown, 
  MapPin, 
  Navigation, 
  Clock, 
  Phone,
  AlertCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  isOpen: boolean;
  closesAt?: string;
  phone: string;
  lat: number;
  lng: number;
}

const mockPharmacies: Pharmacy[] = [
  {
    id: "1",
    name: "CVS Pharmacy",
    address: "123 Main Street, Downtown",
    distance: "0.3 mi",
    isOpen: true,
    closesAt: "10:00 PM",
    phone: "(555) 123-4567",
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: "2",
    name: "Walgreens",
    address: "456 Oak Avenue, Central District",
    distance: "0.7 mi",
    isOpen: true,
    closesAt: "Midnight",
    phone: "(555) 234-5678",
    lat: 37.7739,
    lng: -122.4312,
  },
  {
    id: "3",
    name: "Rite Aid",
    address: "789 Pine Street, Westside",
    distance: "1.2 mi",
    isOpen: false,
    phone: "(555) 345-6789",
    lat: 37.7819,
    lng: -122.4234,
  },
  {
    id: "4",
    name: "Local Community Pharmacy",
    address: "321 Elm Road, Northside",
    distance: "1.5 mi",
    isOpen: true,
    closesAt: "8:00 PM",
    phone: "(555) 456-7890",
    lat: 37.7899,
    lng: -122.4089,
  },
  {
    id: "5",
    name: "HealthMart Pharmacy",
    address: "654 Maple Drive, Eastside",
    distance: "2.1 mi",
    isOpen: true,
    closesAt: "9:00 PM",
    phone: "(555) 567-8901",
    lat: 37.7669,
    lng: -122.4012,
  },
];

export function PharmacyPage() {
  const [locationError] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">HealthAI</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <Link to="/chat" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Chat
              </Link>
              <Link to="/pharmacy" className="text-sm font-medium text-primary">
                Pharmacy
              </Link>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">JD</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Medical History</DropdownMenuItem>
              <DropdownMenuItem>Privacy Settings</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Log Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Map Area */}
        <div className="flex-1 relative bg-muted/30">
          {locationError ? (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Location Access Required</h3>
                <p className="text-sm text-gray-600 mb-6">
                  To show nearby pharmacies on the map, we need access to your location. 
                  Please enable location services in your browser settings.
                </p>
                <Button className="rounded-lg bg-primary hover:bg-primary/90">
                  Enable Location
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Map Placeholder with Pins */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50">
                {/* Grid Pattern */}
                <div 
                  className="absolute inset-0 opacity-[0.15]"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />
                
                {/* Mock Location Pins */}
                <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <MapPin className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-md animate-bounce" style={{ animationDuration: '2s' }} />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black/20 rounded-full blur-sm" />
                  </div>
                </div>

                {mockPharmacies.slice(0, 4).map((pharmacy, idx) => {
                  const positions = [
                    { top: '35%', left: '45%' },
                    { top: '55%', left: '60%' },
                    { top: '45%', left: '25%' },
                    { top: '65%', left: '40%' },
                  ];
                  return (
                    <button
                      key={pharmacy.id}
                      onClick={() => setSelectedPharmacy(pharmacy.id)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 ${
                        selectedPharmacy === pharmacy.id ? 'scale-110' : ''
                      }`}
                      style={positions[idx]}
                    >
                      <MapPin 
                        className={`w-7 h-7 drop-shadow-lg ${
                          selectedPharmacy === pharmacy.id 
                            ? 'text-primary fill-primary' 
                            : 'text-accent fill-accent'
                        }`}
                      />
                    </button>
                  );
                })}

                {/* Map Attribution */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-600">Interactive Map View</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Pharmacy List */}
        <aside className="w-[420px] border-l border-gray-200 bg-white flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 text-lg">Nearby Pharmacies</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              Found {mockPharmacies.length} locations near you
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-100">
              {mockPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className={`p-5 hover:bg-muted/30 transition-colors cursor-pointer ${
                    selectedPharmacy === pharmacy.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => setSelectedPharmacy(pharmacy.id)}
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{pharmacy.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">{pharmacy.distance}</span>
                          <span className="text-gray-300">•</span>
                          {pharmacy.isOpen ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-accent"></div>
                              <span className="text-sm text-accent font-medium">Open</span>
                              {pharmacy.closesAt && (
                                <>
                                  <span className="text-sm text-gray-500">• Closes {pharmacy.closesAt}</span>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              <span className="text-sm text-red-600 font-medium">Closed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span>{pharmacy.address}</span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <span>{pharmacy.phone}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-lg border-gray-300 hover:bg-gray-50"
                      >
                        <Phone className="w-4 h-4 mr-1.5" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 rounded-lg bg-primary hover:bg-primary/90"
                      >
                        <Navigation className="w-4 h-4 mr-1.5" />
                        Directions
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
