# Diagrams

Every diagram is provided in three rendered forms (`.pdf`, `.png`, `.svg`) plus an editable Graphviz source (`.dot`). The proposal includes a readable page for each diagram.

| Diagram | Source | Purpose |
|---|---|---|
| DFD Context / Level 0 | `dfd-context.dot` | System boundary and exchanges with patient/admin actors |
| DFD Level 1 | `dfd-level1.dot` | Search, booking, status, admin/export processes and stores |
| Use case | `use-case.dot` | Patient and demo-admin goals |
| Activity - appointment booking | `activity-booking.dot` | Main booking path, validation and capacity failure paths |
| ERD | `erd.dot` | Proposed normalized production database model; not implemented in current prototype |
| UML class | `class-diagram.dot` | Seven classes implemented in the OOP interface |
| UML object | `object-diagram.dot` | Synthetic sample object instances |

## Regenerate renderings

Requires Graphviz `dot`:

```bash
for f in *.dot; do
  base="${f%.dot}"
  dot -Tpdf "$f" -o "$base.pdf"
  dot -Tpng -Gdpi=180 "$f" -o "$base.png"
  dot -Tsvg "$f" -o "$base.svg"
done
```
