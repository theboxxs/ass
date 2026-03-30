import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// 1. إعدادات Firebase (نفس التي استخدمتها في الصفحات الأخرى)
const firebaseConfig = {
    apiKey: "AIzaSyAj8bNAd5axoXs9EnvGso7kBF1S9dgUEqM",
    authDomain: "asss-d3452.firebaseapp.com",
    databaseURL: "https://asss-d3452-default-rtdb.firebaseio.com",
    projectId: "asss-d3452",
    storageBucket: "asss-d3452.firebasestorage.app",
    messagingSenderId: "169933688004",
    appId: "1:169933688004:web:3d367c0127d12242414d91"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 2. الدالة السحرية لجلب البيانات حسب "النوع" (Mode)
window.loadLeaderboard = async function(mode) {
    const tableBody = document.getElementById("leaderboardBody");
    const titleDisplay = document.getElementById("currentModeTitle");

    // تحديث العنوان ليظفر المستخدم بأي قسم هو الآن
    const names = {
        'addition': 'أبطال الجمع ➕',
        'minus': 'أبطال الطرح ➖',
        'multiplication': 'أبطال الضرب ✖️',
        'division': 'أبطال القسمة ➗'
    };
    if(titleDisplay) titleDisplay.innerText = names[mode];

    tableBody.innerHTML = "<tr><td colspan='3'>جاري تحميل الأبطال... ⏳</td></tr>";

    // طلب البيانات مرتبة حسب السكور (أعلى 10)
    const dbRef = query(ref(db, `leaderboard/${mode}`), orderByChild("score"), limitToLast(10));

    try {
        const snapshot = await get(dbRef);
        tableBody.innerHTML = ""; 
        
        if (snapshot.exists()) {
            let players = [];
            snapshot.forEach((child) => {
                players.push(child.val());
            });

            // ترتيب من الأعلى إلى الأقل
            players.reverse().forEach((player, index) => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${player.name}</td>
                        <td>${player.score.toLocaleString()}</td>
                    </tr>`;
            });
        } else {
            tableBody.innerHTML = "<tr><td colspan='3'>لا توجد نتائج مسجلة في هذا القسم بعد! 🏆</td></tr>";
        }
    } catch (error) {
        console.error("Error:", error);
        tableBody.innerHTML = "<tr><td colspan='3'>خطأ في جلب البيانات، تأكد من اتصال الإنترنت ⚠️</td></tr>";
    }
}

// تشغيل "الجمع" تلقائياً عند فتح الصفحة لأول مرة
window.onload = () => loadLeaderboard('addition');
