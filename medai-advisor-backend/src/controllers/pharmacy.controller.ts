import { Request, Response } from 'express';

const GOOGLE_PLACES_BASE = 'https://places.googleapis.com/v1/places:searchNearby';

// GET /api/v1/pharmacies/nearby
export const nearbyPharmacies = async (req: Request, res: Response): Promise<void> => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const radius = Math.min(Number(req.query.radius) || 2000, 5000);
    const limit = Math.min(Number(req.query.limit) || 20, 50);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'lat/lng invalid' } });
      return;
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Google Places API Key did no set up' } });
      return;
    }

    let places: any[];
    try {
      const response = await fetch(GOOGLE_PLACES_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.currentOpeningHours,places.googleMapsUri',
        },
        body: JSON.stringify({
          includedTypes: ['pharmacy'],
          maxResultCount: limit,
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radius,
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Google Places API responded with ${response.status}`);
      }

      const data = await response.json();
      places = data.places || [];
    } catch (error) {
      console.error('Google Places Error:', error);
      res.status(502).json({ error: { code: 'UPSTREAM_ERROR', message: 'Google Places 查询失败' } });
      return;
    }

    // 计算距离并格式化
    const items = places.map((place: any) => {
      const pLat = place.location?.latitude || 0;
      const pLng = place.location?.longitude || 0;
      const distanceMeters = Math.round(haversineDistance(lat, lng, pLat, pLng));

      return {
        placeId: place.id,
        name: place.displayName?.text || '',
        address: place.formattedAddress || '',
        lat: pLat,
        lng: pLng,
        distanceMeters,
        isOpenNow: place.currentOpeningHours?.openNow ?? null,
        mapsUrl: place.googleMapsUri || null,
      };
    });

    // 按距离排序
    items.sort((a: any, b: any) => a.distanceMeters - b.distanceMeters);

    res.json({ items, nextCursor: null });
  } catch (error) {
    console.error('NearbyPharmacies Error:', error);
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: '服务器内部错误' } });
  }
};

// Haversine 公式计算两点距离（米）
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
