for /d %%G in ("../atlas-raw/*") DO (dir ..\atlas-raw\%%G /b /s >> temp.txt && sspack /image:../media/%%G_atlas.png /map:%%G.txt /pad:1 /il:temp.txt & del /F temp.txt)
atlas_postbuild\bin\atlas_postbuild.exe ../src/sdk/atlases/index.js
del /F *.txt