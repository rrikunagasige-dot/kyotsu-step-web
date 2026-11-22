# 確認事項

- 特定ZIP名はworkflowの必須条件ではない。任意archiveから通常回復するAPIと、publisherの固定seed＋suffix方式がある。
- seedの静的状態、真正prefix部分集合、feedback payload、完全新suffixは型を分ける必要がある。前歴を補完したevents()を作らない。
- 元2sourceはGitから回復できた。原opened envelope、版archivef6e2…、元受付snapshot8911…は未回復。digestから状態を逆生成しない。
- checkpoint導入はDEFINITION_HASHを変える。既存migrate_definitionは完全archive由来copyを要求するため、専用preflightが必要。旧definitionを偽装して失効を回避しない。
- events直読は多数のmoduleにある。未対応の旧nonce/patch/queue/receipt経路を空のsuffixで通さず、typed APIへ接続するか拒否する。
- 試作のhash-valid suffixは操作の意味・承認を証明しない。TEST_FIXTUREの成功は正式受理ではない。
- 中断lockの自動回復、電源断時のdirectory永続性、検査後の同時path差替え、未知prefix nonce全件は試作の範囲外。正式採用前に扱いを検証・明記する。
