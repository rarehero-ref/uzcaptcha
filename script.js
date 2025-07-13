document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    const captchaInput = document.getElementById('captchaInput');
    const verifyButton = document.getElementById('verifyCaptcha');
    const refreshButton = document.getElementById('refreshCaptcha');
    const messageDisplay = document.getElementById('message');
    const closeButton = document.getElementById('closeWindow');

    let captchaText = '';
    let telegramUserId = null; // Telegram user ID ni saqlash uchun

    // URL'dan user_id ni olish funksiyasi
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Captchani chizish funksiyasi
    function drawCaptcha() {
        captchaText = generateRandomString(4); // 4 xonali tasodifiy son
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvasni tozalash

        // Fon ranglari
        const colors = ['#f0e68c', '#ffffff', '#d3d3d3']; // Sariq, oq, kulrang
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = randomColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Chiziqlar va doiralar (shovqin)
        for (let i = 0; i < 6; i++) {
            ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.stroke();
        }

        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < captchaText.length; i++) {
            const char = captchaText[i];
            const x = 30 + i * 40 + Math.random() * 10 - 5; // Harfning joylashuvi
            const y = canvas.height / 2 + Math.random() * 10 - 5; // Harfning joylashuvi

            ctx.fillStyle = `rgb(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150})`; // Tasodifiy qorong'u rang
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((Math.random() - 0.5) * 0.5); // Harfni biroz burish (qiyshiq qilish)
            ctx.fillText(char, 0, 0);
            ctx.restore();
        }
    }

    // Tasodifiy string yaratish (faqat raqamlar)
    function generateRandomString(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Captchani tekshirish
    verifyButton.addEventListener('click', () => {
        const userInput = captchaInput.value.trim();
        if (userInput === captchaText) {
            messageDisplay.textContent = 'Captcha tasdiqlandi!';
            messageDisplay.className = 'show success'; // Yashil rangda ko'rsatish
            verifyButton.classList.add('hidden');
            captchaInput.classList.add('hidden');
            refreshButton.classList.add('hidden');
            closeButton.classList.remove('hidden');

            if (telegramUserId) {
                // Bot username'ini o'zingiznikiga almashtiring!
                const botUsername = 'http://t.me/nftkonkursbot'; // !!! BOTINGIZNING USERNAME'INI KIRITING !!!
                closeButton.innerHTML = "Botga qaytish ✅";
                closeButton.onclick = () => {
                    // Botga maxsus /start buyrug'i yuborish orqali foydalanuvchi tasdiqlanganini bildiramiz
                    window.location.href = `https://t.me/${botUsername}?start=captcha_verified_${telegramUserId}`;
                };

            }
        } else {
            messageDisplay.textContent = 'Noto\'g\'ri kod. Qaytadan urinib ko\'ring.';
            messageDisplay.className = 'show error'; // Qizil rangda ko'rsatish
            drawCaptcha(); // Yangi Captcha yaratish
            captchaInput.value = '';
        }
    });

    // Yangilash tugmasi
    refreshButton.addEventListener('click', drawCaptcha);

    // Saytni yopish tugmasi
    closeButton.addEventListener('click', () => {
        window.close(); // Brauzer oynasini yopishga urinadi
        // Ba'zi brauzerlar security sabab yopmasligi mumkin.
        // Bunday holatda foydalanuvchiga "Endi botga qayting" degan yozuv chiqadi.
    });

    // Sahifa yuklanganda va URL'dan user_id ni olish
    telegramUserId = getUrlParameter('user_id');
    drawCaptcha(); // Birinchi Captchani chizish
});
