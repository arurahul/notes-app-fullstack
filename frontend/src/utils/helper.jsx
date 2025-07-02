// src/utils/helper.js

// Format ISO date string into a human-readable format
export function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Truncate long text content to fit in card previews
export function truncateText(text, maxLength = 100) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

// Capitalize first letter of a string
export function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Format tags to a readable list: ["life", "career"] → "Life, Career"
export function formatTags(tagsArray) {
  if (!tagsArray || tagsArray.length === 0) return "No tags";
  return tagsArray.map(capitalizeFirst).join(", ");
}

// Get initials for avatars (optional for future UI use)
export function getInitials(name = "") {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
