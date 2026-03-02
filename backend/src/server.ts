import dotenv from 'dotenv';
// 환경 변수부터 먼저 로드한 뒤 앱을 가져옵니다.
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
