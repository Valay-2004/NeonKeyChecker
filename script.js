document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const generatePassword = document.getElementById("generatePassword");
    const hashMethod = document.getElementById("hashMethod");
    const resultDiv = document.getElementById("result");
    const circleIcon = document.querySelector(".circle .icon");

    // 🌟 Ensure the correct theme is applied on page load
    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);
    document.getElementById("themeToggle").checked = savedTheme === "light";

    // 🌞 Toggle and Apply Light/Dark Mode
    document.getElementById("themeToggle").addEventListener("change", () => {
        const newTheme = document.getElementById("themeToggle").checked ? "light" : "dark";
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });

    // 💡 Apply Theme + Update Icon
    function applyTheme(theme) {
        document.body.setAttribute("data-theme", theme);
        circleIcon.innerHTML = theme === "light" ? "☀️" : "🌙";
        requestAnimationFrame(() => {
            document.body.style.transform = "translateZ(0)";
        });
    }

    // 🧮 Estimate Crack Time Based on Hash Algorithm
    function estimateCrackTime(password) {
        if (!password) return "No password provided";

        const hash = hashMethod.value;
        const length = password.length;

        // Guess Rates (in guesses/second)
        const guessRates = {
            bcrypt: 10000,         // Slow & Secure
            sha256: 1e10,          // Moderate Speed
            md5: 1e11,             // Fast & Weak
        };

        // Estimate Total Possible Guesses
        const guessCount = Math.pow(95, length); // 95 characters: A-Z, a-z, 0-9, symbols

        // Time to Crack (in seconds)
        const timeToCrack = guessCount / guessRates[hash];

        return formatCrackTime(timeToCrack);
    }

    // 📊 Convert Seconds to Human-Readable Format
    function formatCrackTime(seconds) {
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
        return `${Math.round(seconds / 31536000)} years`;
    }

    // 🔍 Listen for Password Input and Update Crack Time
    passwordInput.addEventListener("input", () => {
        const crackTime = estimateCrackTime(passwordInput.value);
        resultDiv.textContent = `🧮 Estimated Crack Time (${hashMethod.value.toUpperCase()}): ${crackTime}`;
    });

    // 🎯 Listen for Algorithm Changes and Recalculate
    hashMethod.addEventListener("change", () => {
        const crackTime = estimateCrackTime(passwordInput.value);
        resultDiv.textContent = `🧮 Estimated Crack Time (${hashMethod.value.toUpperCase()}): ${crackTime}`;
    });

    // 🔐 Generate a Secure Random Password
    generatePassword.addEventListener("click", () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~";
        const length = 16;
        const password = Array.from(crypto.getRandomValues(new Uint8Array(length)))
            .map((x) => charset[x % charset.length])
            .join("");

        passwordInput.value = password;

        // Update crack time immediately
        const crackTime = estimateCrackTime(password);
        resultDiv.textContent = `🧮 Estimated Crack Time (${hashMethod.value.toUpperCase()}): ${crackTime}`;
    });

    // 🙈 Toggle Password Visibility
    togglePassword.addEventListener("click", () => {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        togglePassword.textContent = passwordInput.type === "password" ? "🙈 Show Password" : "🙉 Hide Password";
    });
});
