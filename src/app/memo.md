#### Table API

| TAPI                            |                                |
| ------------------------------- | ------------------------------ |
| getIsAllRowsSelecte             | () => boolean                  |
| getIsSomeRowsSelected           | () => boolean                  |
| getToggleAllRowsSelectedHandler | () => (event: unknown) => void |

---

#### Row API

| API                      |                                |
| ------------------------ | ------------------------------ |
| getIsSelected            | () => boolean                  |
| getCanSelect             | () => boolean                  |
| getToggleSelectedHandler | () => (event: unknown) => void |
| getCanSelect             | () => (event: unknown) => void |
