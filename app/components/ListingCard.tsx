import ListingImageTile from "./ListingImageTile";
import ElementalSeat from "./ElementalSeat";
import { getListingImage } from "../../lib/getListingImage";
import type { Listing } from "@/types/listing";

type ListingCardProps = {
  listing: Listing;
  isSelected: boolean;
  fallbackLocation: string;
  onSelect: (id: string) => void;
};

export default function ListingCard({
  listing,
  isSelected,
  fallbackLocation,
  onSelect,
}: ListingCardProps) {
  const locationParts = [listing.city, listing.state].filter(Boolean) as string[];
  const imageUrl = getListingImage(listing.image_url, listing.website);

  return (
    <div
      data-listing-id={listing.id}
      onClick={() => onSelect(listing.id)}
      style={{
        padding: 12,
        marginBottom: 8,
        borderRadius: 10,
        cursor: "pointer",
        border: isSelected
          ? "2px solid rgba(255,216,107,0.6)"
          : "1px solid rgba(255,255,255,0.12)",
        background: isSelected
          ? "rgba(255,216,107,0.2)"
          : "rgba(224,240,255,0.14)",
        display: "flex",
        gap: 10,
        alignItems: "center",
        transition: "all 0.15s ease",
        boxShadow: isSelected
          ? "0 2px 12px rgba(255,216,107,0.2)"
          : "0 1px 4px rgba(8,25,45,0.06)",
      }}
    >
      <ListingImageTile imageUrl={imageUrl} name={listing.name} size="sm" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, color: "#e8f4ff", fontSize: 15 }}>
          {listing.name}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "rgba(148,196,236,0.8)",
            marginTop: 2,
          }}
        >
          {locationParts.join(", ") || fallbackLocation}
        </div>
      </div>
      <ElementalSeat element="spirit" size="sm" />
    </div>
  );
}
