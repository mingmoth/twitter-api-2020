# twitter-api-2020 (BackEnd)
專案採前後端分離開發，本專案為[前端專案](https://github.com/mingmoth/twitter)提供API

## Live DEMO
請點[此處](https://mingmoth.github.io/twitter/#/signin)前往  

![image](https://github.com/mingmoth/twitter/blob/main/public/images/twitter-demo.png)


## 本地專案設定(利用終端機)
1. 下載本專案到本地
```
git clone https://github.com/mingmoth/twitter-api-2020.git
```
2. 進入本專案資料夾
```
cd twitter-api-2020
```
3. 安裝所需套件
```
 npm install
```
4. 創建資料庫(利用MySQLＷorkbench)
```
create database ac_twitter_workspace;
```
5. 建立table
```
 npx sequelize db:migrate
```
6. 建立種子資料
```
npx sequelize db:seed:all
```
7. 建立`.env`檔案並設定環境參數(`.env.example`檔案內有實例)
8. 啟動伺服器
```
npm run dev OR  nodemon app.js// windows
```
9. 若看到以下字串即代表成功啟動
`Example app listening on port 3000!`


## 測試帳號
* 管理員帳號： root
* 一般使用者帳號： user1  
* 密碼：皆為： 12345678

