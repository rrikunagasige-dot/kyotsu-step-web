# 機能火柴図（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

# R01_CAPTURE@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R01_CAPTURE@n08 / pre-design / PASSED"]
  N1["source.fixed"]
  N2["feedback.capture"]
  N0 --> N2
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R02_CAUSE@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R02_CAUSE@n08 / pre-design / PASSED"]
  N1["case.retrieve"]
  N2["knowledge.ledger"]
  N3["math.verify"]
  N4["ir.verify"]
  N0 --> N1
  N0 --> N4
  N0 --> N2
  N0 --> N3
```

現在: R07_VERIFY@n08 / READY

# R02_CAUSE@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R02_CAUSE@n08 / pre-design / PASSED"]
  N1["source.audit"]
  N2["novice.audit"]
  N3["math.solve"]
  N4["solution.validate"]
  N0 --> N3
  N0 --> N2
  N0 --> N4
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R03_IMPACT@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R03_IMPACT@n08 / pre-design / PASSED"]
  N1["impact.inventory"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R04_PROPOSAL@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n08 / pre-design / PASSED"]
  N1["math.solve"]
  N2["math.verify"]
  N3["teaching.plan"]
  N4["step.plan"]
  N0 --> N1
  N0 --> N2
  N0 --> N4
  N0 --> N3
```

現在: R07_VERIFY@n08 / READY

# R04_PROPOSAL@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n08 / pre-design / PASSED"]
  N1["blank.plan"]
  N2["prose.compose"]
  N3["text.verify"]
  N4["figure.verify"]
  N0 --> N1
  N0 --> N4
  N0 --> N2
  N0 --> N3
```

現在: R07_VERIFY@n08 / READY

# R04_PROPOSAL@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n08 / pre-design / PASSED"]
  N1["ir.verify"]
  N2["source.audit"]
  N3["novice.audit"]
  N4["solution.validate"]
  N0 --> N1
  N0 --> N3
  N0 --> N4
  N0 --> N2
```

現在: R07_VERIFY@n08 / READY

# R04_PROPOSAL@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n08 / pre-design / PASSED"]
  N1["interaction.plan"]
  N2["solution.review"]
  N0 --> N1
  N0 --> N2
```

現在: R07_VERIFY@n08 / READY

# R06_PATCH@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R06_PATCH@n08 / pre-design / PASSED"]
  N1["ir.compile"]
  N2["render.solution"]
  N0 --> N1
  N0 --> N2
```

現在: R07_VERIFY@n08 / READY

# R07_VERIFY@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R07_VERIFY@n08 / post-implementation / PENDING"]
  N1["math.verify"]
  N2["ir.verify"]
  N3["browser.verify"]
  N4["protected.verify"]
  N0 --> N3
  N0 --> N2
  N0 --> N1
  N0 --> N4
```

現在: R07_VERIFY@n08 / READY

# R07_VERIFY@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R07_VERIFY@n08 / post-implementation / PENDING"]
  N1["solution.validate"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R07_SEMANTIC@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R07_SEMANTIC@n08 / post-implementation / PENDING"]
  N1["source.audit"]
  N2["novice.audit"]
  N3["solution.review"]
  N0 --> N2
  N0 --> N3
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# G2_AUDIT@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["G2_AUDIT@n08 / pre-release / PENDING"]
  N1["protected.verify"]
  N2["impact.inventory"]
  N0 --> N2
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# G3_HOST@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["G3_HOST@n08 / release / PENDING"]
  N1["release.verify"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R03_IMPACT_SWEEP@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R03_IMPACT_SWEEP@n08 / post-fix / PENDING"]
  N1["impact.inventory"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R08_CAPTURE_LEARNING@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["R08_CAPTURE_LEARNING@n08 / repair-finalization / PENDING"]
  N1["case.finalize"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# L01_LEARNING@n08（GENERATED）

台帳HEAD: `0188dbd617a3329d2c586629c334964049de84fa6c94b9ad7e5ca72ad80036c8`

```mermaid
flowchart TD
  N0["L01_LEARNING@n08 / learning / PENDING"]
  N1["case.finalize"]
  N2["ml.train"]
  N0 --> N1
  N0 --> N2
```

現在: R07_VERIFY@n08 / READY

code実行receiptはsnapshot.jsonのcapability_receiptsを参照。AIの意味審査は別記録。
