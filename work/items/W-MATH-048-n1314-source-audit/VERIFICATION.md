# 検証範囲

- 原Word212863byte/SHA93827322一致。既存import-word.py：N13 33block/22math、N14 46block/14math、全25marker、原図3点一致。
- validateTextbookUnitsと既存validateChoices：候補2単元PASS、旧50回答ID/正答/200選択肢キー保持。
- KaTeX：候補の全formula選択肢と空欄を結合した式283件PASS。
- 既存closed-AST solverのsolution_set：具体11解集合＋元不等式への端点2検算PASS。SymPy1.14.0。一般文字aの証明や教育効果の機械証明ではない。
- A/Bの静的原典照合・候補初回FAILと修正後確認を原報告で保持。
- 初回Vite SSR exportは出力成功後のdep-scan終了警告あり。候補検査は既存package/lock一致の依存を使い、configFile:false/noDiscoveryで正常終了。最初のcheck_candidate import相対path誤りは修正し再実行。最初の既定PythonでSymPy不足を確認し、隔離/tmpへ1.14.0を導入して再実行。

未実施：全文R04 IR/compileと表示mapの確定、learner実装、旧保存移行、実四幅UI、新CI/公開・本人受入。診断IRのPASSは全文本文やレイアウトの合格ではない。

正式工程：S00/S01・R01/R02/R03@n13 PASSED、next=R04_PROPOSAL@n13。実case.retrieveはSCOPED_CATALOG・ranked false・modelRan false・trainingRun false。15事例の個別判断を正式結果に保存した。初回context登録のmodelHash不足とR02提出のcase_dispositions不足は既存guardに拒否され、正しい既存版・根拠を揃えて再提出した。診断compileの最初の警告拒否も原JSONに保持。

再検算：node check_candidate.mjs。数理はSymPy1.14.0/mpmath1.3.0を環境に用意し、check_math.pyを実行する。今回の隔離依存は/tmp/n1314-python-deps、実行時PYTHONPATHで指定。原Word本体はSOURCE_PROVENANCE.jsonのLibrary IDから取得でき、抽出indexとハッシュはrepoに保存している。
