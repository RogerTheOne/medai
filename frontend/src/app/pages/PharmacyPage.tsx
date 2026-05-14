import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Activity, MapPin, Navigation, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import { UserMenu } from "../components/UserMenu";

interface Pharmacy {
  placeId: string;
  name: string;
  address: string;
  distanceMeters: number;
  isOpenNow: boolean | null;
  mapsUrl: string | null;
  lat: number;
  lng: number;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export function PharmacyPage() {
  const { accessToken } = useAuth();

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "fetching" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Your browser does not support geolocation.");
      setStatus("error");
      return;
    }

    setStatus("locating");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setUserCoords({ lat, lng });
        setStatus("fetching");

        try {
          const res = await fetch(
            `/api/v1/pharmacies/nearby?lat=${lat}&lng=${lng}&radius=2000&limit=20`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
          }

          const data = await res.json();
          setPharmacies(data.items ?? []);
          setStatus("done");
        } catch (err: unknown) {
          setErrorMsg(err instanceof Error ? err.message : "Failed to fetch pharmacies.");
          setStatus("error");
        }
      },
      (err) => {
        setErrorMsg(
          err.code === 1
            ? "Location access was denied. Please enable location services and try again."
            : "Unable to determine your location. Please try again."
        );
        setStatus("error");
      }
    );
  }, [accessToken]);

  const mapSrc = userCoords
    ? `https://maps.google.com/maps?q=pharmacies+near+${userCoords.lat},${userCoords.lng}&output=embed`
    : null;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">MedAI Advisor</span>
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
          <UserMenu />
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative bg-muted/30">
          {status === "error" ? (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Location Required</h3>
                <p className="text-sm text-gray-600 mb-6">{errorMsg}</p>
                <Button
                  className="rounded-lg bg-primary hover:bg-primary/90"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : status === "locating" || status === "fetching" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-gray-600">
                  {status === "locating" ? "Getting your location..." : "Finding nearby pharmacies..."}
                </p>
              </div>
            </div>
          ) : mapSrc ? (
            <iframe
              src={mapSrc}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : null}
        </div>

        {/* Pharmacy List */}
        <aside className="w-[420px] border-l border-gray-200 bg-white flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900 text-lg">Nearby Pharmacies</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {status === "done"
                ? `Found ${pharmacies.length} locations near you`
                : status === "error"
                ? "Could not load pharmacies"
                : "Searching..."}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {status === "done" && pharmacies.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                <MapPin className="w-8 h-8 text-gray-300" />
                <p className="text-sm">No pharmacies found within 2 km.</p>
              </div>
            )}

            <div className="divide-y divide-gray-100">
              {pharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.placeId}
                  onClick={() => setSelectedId(pharmacy.placeId)}
                  className={`p-5 hover:bg-muted/30 transition-colors cursor-pointer ${
                    selectedId === pharmacy.placeId
                      ? "bg-primary/5 border-l-4 border-l-primary"
                      : ""
                  }`}
                >
                  <div className="space-y-3">
                    {/* Name + status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{pharmacy.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {formatDistance(pharmacy.distanceMeters)}
                          </span>
                          <span className="text-gray-300">•</span>
                          {pharmacy.isOpenNow === true && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="text-sm text-green-600 font-medium">Open now</span>
                            </div>
                          )}
                          {pharmacy.isOpenNow === false && (
                            <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                              <span className="text-sm text-red-600 font-medium">Closed</span>
                            </div>
                          )}
                          {pharmacy.isOpenNow === null && (
                            <span className="text-sm text-gray-400">Hours unknown</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span>{pharmacy.address}</span>
                    </div>

                    {/* Directions button */}
                    <div className="pt-1">
                      <Button
                        size="sm"
                        className="w-full rounded-lg bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          const url =
                            pharmacy.mapsUrl ??
                            `https://www.google.com/maps/dir/?api=1&destination=${pharmacy.lat},${pharmacy.lng}`;
                          window.open(url, "_blank");
                        }}
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
