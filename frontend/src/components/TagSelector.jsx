    // src/components/TagSelector.jsx
    import React from "react";

    export default function TagSelector({ selectedTags, setSelectedTags, allTags=[] }) {
    const toggleTag = (tagName) => {
        setSelectedTags((prev) =>
        prev.includes(tagName)
            ? prev.filter((tag) => tag !== tagName)
            : [...prev, tagName]
        );
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4">
        {allTags.map((tag) => (
            <button
            key={tag.id}
            type="button"
            className={`px-3 py-1 border rounded-full text-sm ${
                selectedTags.includes(tag.name)
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => toggleTag(tag.name)}
            >
            {tag.name}
            </button>
        ))}
        </div>
    );
    }
