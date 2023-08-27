import type { IAddress } from "~/types/address";

function getRandomCoordinate(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function generateRandomLatLon(_address: IAddress) {
  const minLat = 1.23;
  const maxLat = 1.47;
  const minLon = 103.57;
  const maxLon = 104.04;

  const randomLat = getRandomCoordinate(minLat, maxLat).toFixed(6);
  const randomLon = getRandomCoordinate(minLon, maxLon).toFixed(6);

  return {lat: Number(randomLat), lon: Number(randomLon)};
}

const geoCode = (address: IAddress) => {
  const data = generateRandomLatLon(address)
  return data
}

export default geoCode