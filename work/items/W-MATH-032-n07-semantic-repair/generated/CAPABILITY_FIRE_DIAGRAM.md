# 機能火柴図（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

# R01_CAPTURE@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R01_CAPTURE@n07 / pre-design / PASSED"]
  N1["source.fixed"]
  N2["feedback.capture"]
  N0 --> N2
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# R02_CAUSE@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R02_CAUSE@n07 / pre-design / PASSED"]
  N1["case.retrieve"]
  N2["ir.verify"]
  N3["source.audit"]
  N4["novice.audit"]
  N0 --> N1
  N0 --> N2
  N0 --> N4
  N0 --> N3
```

現在: R06_PATCH@n07 / WAITING

# R03_IMPACT@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R03_IMPACT@n07 / pre-design / PASSED"]
  N1["impact.inventory"]
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# R04_PROPOSAL@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n07 / pre-design / PASSED"]
  N1["teaching.plan"]
  N2["step.plan"]
  N3["blank.plan"]
  N4["prose.compose"]
  N0 --> N3
  N0 --> N4
  N0 --> N2
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# R04_PROPOSAL@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n07 / pre-design / PASSED"]
  N1["text.verify"]
  N2["figure.verify"]
  N3["ir.verify"]
  N4["source.audit"]
  N0 --> N2
  N0 --> N3
  N0 --> N4
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# R04_PROPOSAL@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R04_PROPOSAL@n07 / pre-design / PASSED"]
  N1["novice.audit"]
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# R06_PATCH@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R06_PATCH@n07 / pre-design / RUNNING"]
  N1["ir.compile"]
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# R07_VERIFY@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R07_VERIFY@n07 / post-implementation / PENDING"]
  N1["ir.verify"]
  N2["browser.verify"]
  N3["protected.verify"]
  N0 --> N2
  N0 --> N1
  N0 --> N3
```

現在: R06_PATCH@n07 / WAITING

# R07_SEMANTIC@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R07_SEMANTIC@n07 / post-implementation / PENDING"]
  N1["source.audit"]
  N2["novice.audit"]
  N0 --> N2
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# G2_AUDIT@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["G2_AUDIT@n07 / pre-release / PENDING"]
  N1["protected.verify"]
  N2["impact.inventory"]
  N0 --> N2
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# G3_HOST@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["G3_HOST@n07 / release / PENDING"]
  N1["release.verify"]
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# R03_IMPACT_SWEEP@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R03_IMPACT_SWEEP@n07 / post-fix / PENDING"]
  N1["impact.inventory"]
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# R08_CAPTURE_LEARNING@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["R08_CAPTURE_LEARNING@n07 / repair-finalization / PENDING"]
  N1["case.finalize"]
  N0 --> N1
```

現在: R06_PATCH@n07 / WAITING

# L01_LEARNING@n07（GENERATED）

台帳HEAD: `4d5a8c72cb7101fb630382cd76cd19d47a398c079b1db57f00fd4605ffab9e17`

```mermaid
flowchart TD
  N0["L01_LEARNING@n07 / learning / PENDING"]
  N1["case.finalize"]
  N2["ml.train"]
  N0 --> N1
  N0 --> N2
```

現在: R06_PATCH@n07 / WAITING

code実行receiptはsnapshot.jsonのcapability_receiptsを参照。AIの意味審査は別記録。
