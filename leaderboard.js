import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

async function loadData(category) {
    const body = document.getElementById("leaderboardBody");
    body.innerHTML = "<tr><td colspan='3'>جاري الفحص...</td></tr>";

    try {
        // فحص الاتصال البسيط أولاً
        const dbRef = query(ref(db, `leaderboard/${category}`), orderByChild('score'), limitToLast(10));
        const snapshot = await get(dbRef);
        
        body.innerHTML = "";

        if (snapshot.exists()) {
            let players = [];
            snapshot.forEach(child => players.push(child.val()));
            players.reverse();

            players.forEach((p, i) => {
                body.innerHTML += `<tr><td>${i+1}</td><td>${p.name}</td><td>${p.score}</td></tr>`;
            });
        } else {
            body.innerHTML = "<tr><td colspan='3'>لا توجد بيانات في قسم: " + category + "</td></tr>";
        }
    } catch (e) {
        console.error("Firebase Error:", e);
        // سيعرض لك السبب الحقيقي للخطأ بالإنجليزية على الشاشة
        body.innerHTML = `<tr><td colspan='3' style='color:red;'>سبب الخطأ: ${e.message}</td></tr>`;
    }
}

window.switchTab = function(category, element) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    loadData(category);
}

// البدء بتحميل بيانات الجمع
loadData('addition');