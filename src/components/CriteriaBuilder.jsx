export default function CriteriaBuilder({
  criteria,
  onAdd,
  onUpdate,
  onRemove
}) {
  return (
    <div className="form-group">
      <label>Kriteria penilaian</label>

      <div className="criteria-builder">
        {criteria.map((criterion, index) => (
          <div className="criteria-row" key={criterion.id}>
            <input
              placeholder={`Kriteria ${index + 1}`}
              value={criterion.name}
              onChange={(e) => onUpdate(criterion.id, e.target.value)}
            />
            <button
              type="button"
              className="danger-button"
              onClick={() => onRemove(criterion.id)}
              disabled={criteria.length === 1}
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="secondary-button add-button"
        onClick={onAdd}
      >
        Tambah Kriteria
      </button>
    </div>
  );
}