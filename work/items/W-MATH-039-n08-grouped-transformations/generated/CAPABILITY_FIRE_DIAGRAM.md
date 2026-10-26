# 機能火柴図（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

# R01_CAPTURE@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

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

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["R02_CAUSE@n08 / pre-design / PASSED"]
  N1["case.retrieve"]
  N2["ir.verify"]
  N3["source.audit"]
  N4["novice.audit"]
  N0 --> N1
  N0 --> N2
  N0 --> N4
  N0 --> N3
```

現在: R07_VERIFY@n08 / READY

# R02_CAUSE@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["R02_CAUSE@n08 / pre-design / PASSED"]
  N1["solution.validate"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R03_IMPACT@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["R03_IMPACT@n08 / pre-design / PASSED"]
  N1["impact.inventory"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R04_PROPOSAL@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n08 / pre-design / PASSED"]
  N1["teaching.plan"]
  N2["step.plan"]
  N3["blank.plan"]
  N4["prose.compose"]
  N0 --> N3
  N0 --> N4
  N0 --> N2
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R04_PROPOSAL@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n08 / pre-design / PASSED"]
  N1["text.verify"]
  N2["figure.verify"]
  N3["ir.verify"]
  N4["source.audit"]
  N0 --> N2
  N0 --> N3
  N0 --> N4
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R04_PROPOSAL@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n08 / pre-design / PASSED"]
  N1["novice.audit"]
  N2["solution.validate"]
  N3["interaction.plan"]
  N4["solution.review"]
  N0 --> N3
  N0 --> N1
  N0 --> N4
  N0 --> N2
```

現在: R07_VERIFY@n08 / READY

# R06_PATCH@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

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

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["R07_VERIFY@n08 / post-implementation / PENDING"]
  N1["ir.verify"]
  N2["browser.verify"]
  N3["protected.verify"]
  N4["solution.validate"]
  N0 --> N2
  N0 --> N1
  N0 --> N3
  N0 --> N4
```

現在: R07_VERIFY@n08 / READY

# R07_SEMANTIC@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

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

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

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

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["G3_HOST@n08 / release / PENDING"]
  N1["release.verify"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R03_IMPACT_SWEEP@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["R03_IMPACT_SWEEP@n08 / post-fix / PENDING"]
  N1["impact.inventory"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# R08_CAPTURE_LEARNING@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

```mermaid
flowchart TD
  N0["R08_CAPTURE_LEARNING@n08 / repair-finalization / PENDING"]
  N1["case.finalize"]
  N0 --> N1
```

現在: R07_VERIFY@n08 / READY

# L01_LEARNING@n08（GENERATED）

台帳HEAD: `4054f0158ffc59464d4b7f04c22f6000fe46f2f80c36df70b14c69b5e542a42c`

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
