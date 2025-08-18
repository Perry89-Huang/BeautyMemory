@echo off
echo =======================================
echo 美魔力 Beauty Memory 依賴修復腳本
echo =======================================
echo.

echo step 1...
if exist node_modules (
    echo deleting node_modules...
    rmdir /s /q node_modules
    echo node_modules deleted
) else (
    echo node_modules not exist, skip
)

if exist package-lock.json (
    echo deleting package-lock.json...
    del package-lock.json
    echo package-lock.json deleted
) else (
    echo package-lock.json not exist, skip
)

echo.
echo Step 2: clear npm cache...
npm cache clean --force
echo npm  cache cleared 

echo.
echo Step 3...
npm install

echo.
echo Step 4 ...
npm uninstall lucide-react 2>nul
npm install react-icons@^4.12.0

echo.
echo Step 5...
npm install jszip@^3.10.1

echo.
echo =======================================
echo Fixed completed
echo =======================================
echo.
echo Use command below:
echo npm start
echo.
pause