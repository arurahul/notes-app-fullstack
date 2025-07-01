    export default function TagFilter({ selectedTag, onChange, tags = [] }) {
    return (
        <div>
        <label htmlFor="tag-filter" className="sr-only">
            Filter by Tag
        </label>
        <select
            id="tag-filter"
            className="mb-4 p-2 border rounded"
            value={selectedTag}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">All Tags</option>
            {tags.map((tag) => (
            <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
            ))}
        </select>
        </div>
    );
    }
