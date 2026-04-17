# JavaScript 進階函數與 V8 VM 記憶體模型指針分析報告

> **作者**：洪晨祐 (111410517)  
> **學科**：網頁設計進階 JavaScript 專題研究  
> **指導教授**：陳鍾誠 教授

---

## 壹、 核心執行結果之深層本質

在 `task08_reference_trap.js` 中，執行 `processDataSequences(dataSequenceAlpha, dataSequenceBeta)` 後的結果如下：
*   `dataSequenceAlpha` ➔ **`[1, 2, 99]`** （原始陣列被就地修改）
*   `dataSequenceBeta`  ➔ **`[3, 4]`**     （原始陣列保持不變）

這項看似簡單的行為，在 Google V8 引擎底層涉及到了 **In-place Mutation（就地修改）** 與 **Pointer Rebinding（指針重新綁定 / 重新賦值）** 的根本性學術差異。

---

## 貳、 V8 VM 逃逸分析與閉包記憶體逃逸機制

### 一、 傳統「棧堆二分法」的學術誤區
坊間常有簡化說法宣稱「基本型別儲存於 Stack，引用型別儲存於 Heap」。這在現代高階 JavaScript 引擎（如 V8）中並不準確。
*   **逃逸分析 (Escape Analysis)**：V8 引擎在 TurboFan 編譯器優化階段，會對所有變數進行逃逸分析。若一個基本型別變數（例如 `scaleFactor` 在閉包中）生命週期超出了當前 Stack 幀，或者被內部函數（閉包）所捕獲，V8 就會判定該變數「逃逸」了。
*   **Context 堆分配**：為了讓被捕獲的變數在外部函數棧幀被彈出（Pop）後依然存活，V8 會在 **Heap 中創建一個 `Context` 物件**，並將逃逸的變數放置其中，而 Stack 幀中僅保留指向該 Context 物件的指針。

### 二、 JSArray 底層記憶體佈局
在 V8 中，`JSArray` 是一個繼承自 `JSObject` 的 C++ 物件，在 Heap 記憶體中並非單一的資料塊。它主要由三部分組成：
1.  **Map**：指向 Hidden Class（描述陣列的 Elements Kind，如 `PACKED_SMI_ELEMENTS`）。
2.  **Properties**：存放命名屬性的 `FixedArray` 指標。
3.  **Elements**：指向存放真正陣列元素（如 `[1, 2]`）的 `FixedArray` 指標。

---

## 參、 V8 引擎底層記憶體模型教科書級 ASCII 圖表

### 【圖一：processDataSequences 執行時的精細棧幀與 V8 Heap 物件實體佈局】

```text
========================================================================================
                      V8 VM CALL STACK & HEAP LAYOUT (DURING INVOCATION)
========================================================================================

[ CALL STACK (LIFO) ]                                  [ HEAP (GARBAGE COLLECTED) ]
+-----------------------------------------+            +---------------------------------------+
|  processDataSequences Activation Frame  |            |  JSArray (dataSequenceAlpha)          |
|  =====================================  |            |  +---------------------------------+  |
|  [Parameters & Local Variables]         |            |  | Map: [Shape Info Pointer]       |  |
|   - sequenceA : 0x0017FA9C  -----------+------------+->| Properties: [EmptyFixedArray]   |  |
|   - sequenceB : 0x0017FAB8 (Reassigned)|--+         |  | Elements: 0x0024B100 -----------+  |
|                                         |  |         |  +---------------------------------+  |
|  [Control Info]                         |  |         |                                       |
|   - Return Address: 0x08F4C23A          |  |         |  FixedArray (Alpha Elements Storage)  |
|   - Frame Pointer (EBP): 0x0078FF10     |  |         |  +---------------------------------+  |
|                                         |  |         |  | 0x0024B100: [ 1 | 2 | 99 ]        |  |
+-----------------------------------------+  |         |  +---------------------------------+  |
|  Global Execution Context Frame         |  |         |                                       |
|  ==============================         |  |         |  JSArray (dataSequenceBeta)           |
|  [Variables]                            |  |         |  +---------------------------------+  |
|   - dataSequenceAlpha: 0x0017FA9C ------+  |         |  | Map: [Shape Info Pointer]       |  |
|   - dataSequenceBeta : 0x0017FAC4 ------+--+---------+->| Properties: [EmptyFixedArray]   |  |
|                                         |  |         |  | Elements: 0x0024B200 -----------+  |
|                                         |  |         |  +---------------------------------+  |
|                                         |  |         |                                       |
|                                         |  |         |  FixedArray (Beta Elements Storage)   |
|                                         |  |         |  +---------------------------------+  |
|                                         |  |         +->| 0x0024B200: [ 3 | 4 ]             |  |
|                                         |  |         |  +---------------------------------+  |
|                                         |  |         |                                       |
|                                         |  |         |  JSArray (New Reassigned Array [100]) |
|                                         |  |         |  +---------------------------------+  |
|                                         |  |         |  | Map: [Shape Info Pointer]       |  |
|                                         |  |         |  | Properties: [EmptyFixedArray]   |  |
|                                         |  +---------+->| Elements: 0x0024B300 -----------+  |
|                                         |            |  +---------------------------------+  |
|                                         |            |                                       |
|                                         |            |  FixedArray (New Elements Storage)    |
|                                         |            |  +---------------------------------+  |
|                                         |            +->| 0x0024B300: [ 100 ]             |  |
|                                         |            |  +---------------------------------+  |
+-----------------------------------------+            +---------------------------------------+
```

---

### 【圖二：高階函數閉包變數逃逸與 [[Scopes]] 鏈指標結構（以 Task 05 乘數產生器為例）】

```text
========================================================================================
                     V8 VM CLOSURE MEMORY LAYOUT & ESCAPE ANALYSIS
========================================================================================

[ CALL STACK ]                                         [ HEAP (GARBAGE COLLECTED) ]
+-----------------------------------------+            +---------------------------------------+
|  (createNumberMultiplier execution      |            |  JSFunction (doubleMultiplier)        |
|   completed, its Stack Frame has been   |            |  +---------------------------------+  |
|   popped and destroyed)                 |            |  | Map: [Function Shape Pointer]   |  |
+-----------------------------------------+            |  | Code: [Compiled Machine Code]   |  |
                                                       |  | Scopes -------------------------+--+
[ CALL STACK DURING INVOCATION ]                       |  +---------------------------------+  |
+-----------------------------------------+            |                                       |
|  doubleMultiplier(10) Activation Frame  |            |  Closure Context Object (Heap)        |
|  =====================================  |            |  (Escaped Lexical Environment)        |
|  [Parameters & Local Variables]         |            |  +---------------------------------+  |
|   - inputValue: 10                      |            |  | scaleFactor: 2                  |<--+
|                                         |            |  | Context Outer: [Global Context] |  |
|  [Scope Pointer] -----------------------+------------+->+---------------------------------+  |
|  (Points to closure context in heap)    |            |                                       |
+-----------------------------------------+            +---------------------------------------+
```

---

### 【圖三：Event Loop、Web APIs、與 Macrotask Queue 在 2 秒延遲下的動態指向圖】

```text
========================================================================================
                           V8 EVENT LOOP & ASYNCHRONOUS ENGINE
========================================================================================

[ V8 CALL STACK (LIFO) ]       [ WEB APIs (HOST THREADS) ]     [ MACROTASK QUEUE (FIFO) ]
+----------------------+       +-------------------------+     +------------------------+
|                      |       |  Timer Engine           |     | [setTimeout Callback]  |
|  Call Stack is Empty |       |  +--------------------+ |     | - Target: JSFunction   |
|  (Ready for Task)    |       |  | Delay: 2000ms      | |     | - Scopes: Closure Ref  |
|                      |       |  | Status: EXPIRED    | |     |                        |
+----------------------+       |  +--------------------+ |     +------------------------+
          ▲                    +------------+------------+                  │
          │                                 │                               │
          │                                 ▼                               │
          │                        (Push to Queue)                          │
          │                                 └───────────────────────────────┘
          │
          │ (Event Loop Tick: Dequeue and push to Call Stack)
          └─────────────────────────────────────────────────────────────────┘
```

---

## 肆、 結論與工程啟發

1.  **Immutability (不可變性) 的重要性**：在前端框架（如 React / Redux）中，直接修改引用（In-place Mutation）會導致虛擬 DOM 無法偵測狀態變化而拒絕重繪。我們必須掌握非破壞性方法（如 `map`、`filter`）來避免變數污染。
2.  **時空開銷折中 (Trade-off)**：理解閉包所引起的逃逸分析與內存堆分配，有助於我們避免在極致頻繁調用的核心迴圈中濫用過深的閉包結構，從而規避垃圾回收器（GC）的過度壓力。