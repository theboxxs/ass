import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// 1. إعدادات Firebase
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
let isGameOver = false;

// 2. إدارة المدخلات (تحسين استجابة Enter)
document.addEventListener("keydown", function(e) {
    const input = document.getElementById("answerInput");
    // التأكد أن الضغط على Enter يحدث فقط عندما يكون قسم الأسئلة ظاهراً واللعبة لم تنتهِ
    if (e.key === "Enter" && document.getElementById("questionSection").style.display === "block" && !isGameOver) {
        e.preventDefault();
        checkAnswer();
    }
});

// 3. دالة بدء الاختبار
window.startQuiz = function() {
    score = 0; 
    tries = 0;
    isGameOver = false;
    startTime = Date.now();
    
    document.getElementById("triesCount").innerText = "0";
    document.getElementById("scoreCount").innerText = "0";
    document.getElementById("startSection").style.display = "none";
    document.getElementById("resultSection").style.display = "none";
    document.getElementById("questionSection").style.display = "block";
    
    newQuestion();
};

// 4. دالة إنشاء سؤال ضرب جديد
function newQuestion() {
    num1 = Math.floor(Math.random() * 10) + 1; 
    num2 = Math.floor(Math.random() * 10) + 1;
    rightAnswer = num1 * num2;
    
    document.getElementById("equationText").innerText = `${num1} × ${num2} = ?`;
    const input = document.getElementById("answerInput");
    input.value = "";
    input.focus(); 
}

// 5. دالة التحقق من الإجابة
window.checkAnswer = function() {
    if (isGameOver) return;

    const userInp = document.getElementById("answerInput");
    const val = userInp.value.trim();

    if (val === "") return; 

    // التحقق من الإجابة
    if (parseInt(val) === rightAnswer) {
        score++;
    }

    tries++;
    document.getElementById("triesCount").innerText = tries;
    document.getElementById("scoreCount").innerText = score;

    if (tries < 10) {
        newQuestion();
    } else {
        isGameOver = true;
        finishQuiz();
    }
};

// 6. إنهاء الاختبار وحفظ النتيجة
function finishQuiz() {
    const timeTaken = (Date.now() - startTime) / 1000;
    
    // معادلة النقاط: (الإجابات الصحيحة × 1000) مقسومة على (الزمن + 1 لتجنب القسمة على صفر)
    // أضفت زيادة بسيطة لوزن الإجابات الصحيحة ليكون لها التأثير الأكبر
    let finalPoints = 0;
    if (score > 0) {
        finalPoints = Math.floor((score * 10000) / (timeTaken * 0.5)); 
    }

    document.getElementById("questionSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";
    document.getElementById("finalResult").innerText = finalPoints.toLocaleString() + " نقطة";

    // جلب اسم المستخدم (تأكد من تخزينه عند تسجيل الدخول)
    const name = localStorage.getItem('activeUser') || "بطل أُسُس";
    
    // الحفظ في Firebase
    push(ref(db, 'leaderboard/multiplication'), {
        name: name,
        score: finalPoints,
        correctAnswers: score,
        timeTaken: timeTaken.toFixed(2),
        timestamp: new Date().toISOString() // بصمة زمنية عالمية أدق
    }).then(() => {
        console.log("تم تحديث قائمة أبطال الضرب!");
    }).catch((error) => {
        console.error("خطأ في الحفظ:", error);
    });
}
