# ArchiMate source description

Primary specification: https://pubs.opengroup.org/architecture/archimate3-doc/

This repository uses a small VAD-like ArchiMate profile rather than the full language. The profile maps table columns to ArchiMate concepts:

| Table field | ArchiMate concept |
| --- | --- |
| event | Business Event |
| activity | Business Process |
| input/output | Business Object |
| role | Business Role |
| system | Application Component |
| comment | Meaning / Representation |

The local `archimate-vad-profile.owl` file records the subset used by `ver2VAD/js/archimate-vad.js`. It is not a replacement for the official Open Group specification.
