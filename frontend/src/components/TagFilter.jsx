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
            {console.log(tags)}
            {tags.map((tag) => (
            <option key={tag.id} value={tag.name}>
                {tag.name}
            </option>
            ))}
        </select>
        </div>
    );
    }
