import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// إعدادات Firebase
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

let score = 0, tries = 0, num1, num2, rightAnswer, startTime;

// بدء الاختبار
window.startQuiz = function() {
    score = 0; tries = 0;
    startTime = Date.now();
    document.getElementById("startSection").style.display = "none";
    document.getElementById("questionSection").style.display = "block";
    newQuestion();
};

function newQuestion() {
    num1 = Math.floor(Math.random() * 20) + 1;
    num2 = Math.floor(Math.random() * 20) + 1;
    rightAnswer = num1 - num2;
    document.getElementById("equationText").innerText = `${num1} - ${num2} = ?`;
    document.getElementById("answerInput").value = "";
    document.getElementById("answerInput").focus();
}

// التحقق من الإجابة
// نفس الكود السابق مع التأكد من ربط الأحداث
window.checkAnswer = function() {
    const userInp = document.getElementById("answerInput");
    const val = userInp.value.trim();

    if (val === "") return;

    if (parseInt(val) === rightAnswer) {
        score++;
    }

    tries++;
    document.getElementById("triesCount").innerText = tries;
    document.getElementById("scoreCount").innerText = score;

    if (tries < 10) {
        newQuestion();
    } else {
        finishQuiz();
    }
};

// مستمع الكيبورد (للكمبيوتر)
document.getElementById("answerInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

// تفعيل زر Enter
document.getElementById("answerInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        checkAnswer();
    }
});

// إنهاء الاختبار وحفظ النتيجة
function finishQuiz() {
    const timeTaken = (Date.now() - startTime) / 1000; // الوقت بالثواني
    
    // معادلة النقاط: (الإجابات الصحيحة × 1000) مقسومة على (الوقت / 10)
    // كل ما قل الوقت، زادت النقاط بشكل جنوني!
    let finalPoints = 0;
    if (score > 0) {
        finalPoints = Math.floor((score * 10000) / timeTaken);
    }

    document.getElementById("questionSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";
    
    // عرض النقاط بدلاً من النسبة المئوية
    document.getElementById("finalResult").innerText = finalPoints.toLocaleString() + " نقطة";

    const name = localStorage.getItem('activeUser') || "لاعب أُسُس";
    
    // حفظ النقاط في Firebase
    push(ref(db, 'leaderboard/minus'), {
        name: name,
        score: finalPoints, // هنا خزننا النقاط الكبيرة
        time: new Date().toLocaleString()
    });
}
