/* =========================
   API
========================= */

const API =
    "https://script.google.com/macros/s/AKfycbzuJZY4hpkAHjHlJF6Op988or1H0aXtOpddbAUMhN5bXq6QMIkcRRd09o7jTSpxd1Sz/exec";


/* =========================
   遊戲狀態
========================= */

let selectedColors = [];

let finalColor = "#29232d";

let currentFortune = null;

let currentPrayerCode = "";


/* =========================
   DOM
========================= */

const screens = {

    start:
        document.getElementById("startScreen"),

    color:
        document.getElementById("colorScreen"),

    mix:
        document.getElementById("mixScreen"),

    result:
        document.getElementById("resultScreen"),

    prayer:
        document.getElementById("prayerScreen"),

    prayerResult:
        document.getElementById("prayerResultScreen"),

    reply:
        document.getElementById("replyScreen")

};


const startBtn =
    document.getElementById("startBtn");

const colorTubes =
    document.querySelectorAll(".color-tube");

const selectedCount =
    document.getElementById("selectedCount");

const cauldron =
    document.getElementById("cauldron");

const mixture =
    document.getElementById("mixture");

const mixBtn =
    document.getElementById("mixBtn");

const fortuneCard =
    document.getElementById("fortuneCard");

const prayBtn =
    document.getElementById("prayBtn");

const prayerInput =
    document.getElementById("prayerInput");

const charCount =
    document.getElementById("charCount");

const submitPrayer =
    document.getElementById("submitPrayer");

const savedPrayer =
    document.getElementById("savedPrayer");

const restartBtn =
    document.getElementById("restartBtn");

const prayerCode =
    document.getElementById("prayerCode");

const checkReplyFromResult =
    document.getElementById(
        "checkReplyFromResult"
    );

const checkReplyBtn =
    document.getElementById(
        "checkReplyBtn"
    );

const prayerCodeInput =
    document.getElementById(
        "prayerCodeInput"
    );

const replyMessage =
    document.getElementById(
        "replyMessage"
    );

const godfatherReply =
    document.getElementById(
        "godfatherReply"
    );

const replyText =
    document.getElementById(
        "replyText"
    );

const replyBackBtn =
    document.getElementById(
        "replyBackBtn"
    );

const homeReplyBtn =
    document.getElementById("homeReplyBtn");

if (homeReplyBtn) {

    homeReplyBtn.addEventListener(
        "click",
        () => {

            prayerCodeInput.value = "";

            replyMessage.textContent = "";

            godfatherReply.style.display =
                "none";

            showScreen(
                screens.reply
            );

        }
    );

}
/* =========================
   切換畫面
========================= */

function showScreen(screen) {

    Object.values(screens).forEach(item => {

        if (item) {
            item.classList.remove("active");
        }

    });

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================
   開始遊戲
========================= */

startBtn.addEventListener("click", () => {

    showScreen(screens.color);

});


/* =========================
   顏色選擇
========================= */

colorTubes.forEach(tube => {

    tube.addEventListener(
        "dragstart",
        event => {

            event.dataTransfer.setData(
                "color",
                tube.dataset.color
            );

            event.dataTransfer.setData(
                "name",
                tube.dataset.name
            );

        }
    );


    tube.addEventListener(
        "click",
        () => {

            const color =
                tube.dataset.color;

            const name =
                tube.dataset.name;

            toggleColor(
                color,
                name,
                tube
            );

        }
    );

});


/* =========================
   染缸接收拖曳
========================= */

cauldron.addEventListener(
    "dragover",
    event => {

        event.preventDefault();

    }
);


cauldron.addEventListener(
    "drop",
    event => {

        event.preventDefault();

        const color =
            event.dataTransfer.getData(
                "color"
            );

        const name =
            event.dataTransfer.getData(
                "name"
            );

        const tube =
            [...colorTubes].find(
                item =>
                    item.dataset.color ===
                    color
            );

        if (tube) {

            toggleColor(
                color,
                name,
                tube
            );

        }

    }
);


/* =========================
   顏色加入／移除
========================= */

function toggleColor(
    color,
    name,
    tube
) {

    const index =
        selectedColors.findIndex(
            item =>
                item.color === color
        );


    if (index !== -1) {

        selectedColors.splice(
            index,
            1
        );

        tube.classList.remove(
            "selected"
        );

    }

    else {

        if (
            selectedColors.length >= 3
        ) {
            return;
        }

        selectedColors.push({
            color,
            name
        });

        tube.classList.add(
            "selected"
        );

    }


    updateSelection();

}


/* =========================
   更新選擇狀態
========================= */

function updateSelection() {

    selectedCount.textContent =
        `${selectedColors.length} / 3`;


    if (
        selectedColors.length === 3
    ) {

        mixBtn.classList.remove(
            "disabled"
        );

        document.getElementById(
            "dropText"
        ).textContent =
            "三種魔法已經準備好了。";

    }

    else {

        mixBtn.classList.add(
            "disabled"
        );

        document.getElementById(
            "dropText"
        ).textContent =
            `還需要 ${
                3 - selectedColors.length
            } 種魔法`;

    }

}


/* =========================
   開始調配
========================= */

mixBtn.addEventListener(
    "click",
    () => {

        if (
            selectedColors.length !== 3
        ) {
            return;
        }

        finalColor =
            mixColors(
                selectedColors.map(
                    item => item.color
                )
            );


        showScreen(
            screens.mix
        );


        setTimeout(
            () => {

                showResult();

            },
            2600
        );

    }
);


/* =========================
   RGB 顏色混合
========================= */

function mixColors(colors) {

    const rgbValues =
        colors.map(hexToRgb);


    const r =
        Math.round(
            rgbValues.reduce(
                (sum, rgb) =>
                    sum + rgb.r,
                0
            ) /
            rgbValues.length
        );


    const g =
        Math.round(
            rgbValues.reduce(
                (sum, rgb) =>
                    sum + rgb.g,
                0
            ) /
            rgbValues.length
        );


    const b =
        Math.round(
            rgbValues.reduce(
                (sum, rgb) =>
                    sum + rgb.b,
                0
            ) /
            rgbValues.length
        );


    return rgbToHex(
        r,
        g,
        b
    );

}


function hexToRgb(hex) {

    const value =
        hex.replace("#", "");


    return {

        r:
            parseInt(
                value.substring(0, 2),
                16
            ),

        g:
            parseInt(
                value.substring(2, 4),
                16
            ),

        b:
            parseInt(
                value.substring(4, 6),
                16
            )

    };

}


function rgbToHex(
    r,
    g,
    b
) {

    return "#" +
        [r, g, b]
            .map(
                value =>
                    value
                        .toString(16)
                        .padStart(
                            2,
                            "0"
                        )
            )
            .join("");

}


/* =========================
   顯示結果
========================= */

function showResult() {

    showScreen(
        screens.result
    );


    mixture.style.background =
        finalColor;


    document.getElementById(
        "resultColor"
    ).style.background =
        finalColor;


    document.getElementById(
        "colorResultText"
    ).textContent =
        `你的魔法色：${finalColor}`;


    const fortune =
        getFortune();


    currentFortune =
        fortune;


    document.getElementById(
        "fortuneIcon"
    ).textContent =
        fortune.icon;


    document.getElementById(
        "fortuneTitle"
    ).textContent =
        fortune.title;


    document.getElementById(
        "fortuneText"
    ).textContent =
        fortune.text;


    fortuneCard.classList.remove(
        "flipped"
    );


    setTimeout(
        () => {

            fortuneCard.classList.add(
                "flipped"
            );

        },
        700
    );

}


/* =========================
   運勢
========================= */

function getFortune() {

    const fortunes = [

        {
            icon: "🐸",
            title: "大吉",
            text:
                "金蟾吐財，福氣自來。今天的魔法能量非常旺盛，適合勇敢地做出新的嘗試。"
        },

        {
            icon: "🗝️",
            title: "吉",
            text:
                "命運之門已經為你留了一把鑰匙。只差一點點，你就能打開好運的大門。"
        },

        {
            icon: "☂️",
            title: "不吉",
            text:
                "今日烏雲籠罩，魔法能量略顯不足。適合低調行動，先別跟命運硬碰硬。"
        },

        {
            icon: "💧",
            title: "超不吉",
            text:
                "恭喜，你成功把命運煮成了一攤泥。今天請避免做出太衝動的重大決定。"
        }

    ];


    const randomIndex =
        Math.floor(
            Math.random() *
            fortunes.length
        );


    return fortunes[
        randomIndex
    ];

}


/* =========================
   禱告
========================= */

prayBtn.addEventListener(
    "click",
    () => {

        showScreen(
            screens.prayer
        );

    }
);


/* =========================
   字數統計
========================= */

prayerInput.addEventListener(
    "input",
    () => {

        charCount.textContent =
            prayerInput.value.length;

    }
);


/* =========================
   提交禱告
========================= */
const playerName = document.getElementById("playerName");

playerName.addEventListener("input", () => {

    playerName.value =
        playerName.value.replace(
            /[^\u4e00-\u9fffA-Za-z]/g,
            ""
        );

});
submitPrayer.addEventListener(
    "click",
    async () => {

        const prayer =
            prayerInput.value.trim();


        if (!prayer) {

            alert(
                "孩子……至少告訴教父，你在想什麼吧。"
            );

            return;

        }


        submitPrayer.disabled = true;

        submitPrayer.textContent =
            "🕯️ 教父正在聆聽……";


      try {

    const params = new URLSearchParams({
        action: "createPrayer",
        colors: selectedColors
            .map(item => item.name)
            .join(","),
        mixedColor: finalColor,
        fortune: currentFortune
            ? currentFortune.title
            : "",
        prayer: prayer
    });

    const response = await fetch(
        API + "?" + params.toString()
    );

    const data = await response.json();

    if (!data.ok) {

        throw new Error(
            data.message ||
            "禱告送出失敗"
        );

    }

    /* =========================
       成功取得祈禱編號
    ========================= */

    currentPrayerCode = data.code;

    localStorage.setItem(
        "godfatherPrayer",
        prayer
    );

    localStorage.setItem(
        "godfatherPrayerCode",
        currentPrayerCode
    );

    savedPrayer.textContent =
        prayer;

    prayerCode.textContent =
        currentPrayerCode;

    showScreen(
        screens.prayerResult
    );

}
catch (error) {

    alert(
        "禱告送出失敗：\n" +
        error.message
    );

}
finally {

    submitPrayer.disabled = false;

    submitPrayer.textContent =
        "🕯️ 獻上禱告";

}

});

/* =========================
   從完成畫面查看回信
========================= */

if (checkReplyFromResult) {

    checkReplyFromResult.addEventListener(
        "click",
        () => {

            const code =
                currentPrayerCode ||
                localStorage.getItem(
                    "godfatherPrayerCode"
                );


            if (!code) {

                showScreen(
                    screens.reply
                );

                return;

            }


            prayerCodeInput.value =
                code;


            showScreen(
                screens.reply
            );


            checkGodfatherReply(
                code
            );

        }
    );

}


/* =========================
   查詢按鈕
========================= */

if (checkReplyBtn) {

    checkReplyBtn.addEventListener(
        "click",
        () => {

            const code =
                prayerCodeInput.value
                    .trim()
                    .toUpperCase();


            if (!code) {

                replyMessage.textContent =
                    "請輸入你的祈禱編號。";

                return;

            }


            checkGodfatherReply(
                code
            );

        }
    );

}


/* =========================
   Enter 查詢
========================= */

if (prayerCodeInput) {

    prayerCodeInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                checkReplyBtn.click();

            }

        }
    );

}


/* =========================
   查詢教父回信
========================= */

async function checkGodfatherReply(
    code
) {

    replyMessage.textContent =
        "🕯️ 教父正在翻閱檔案……";


    godfatherReply.style.display =
        "none";


    try {

        const url =
            API +
            "?action=getPrayer" +
            "&code=" +
            encodeURIComponent(
                code
            );


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (!data.ok) {

            throw new Error(
                data.message ||
                "找不到這份祈禱。"
            );

        }


        /*
         * 尚未開放
         */

        if (
            data.locked
        ) {

            replyMessage.textContent =
                "🕯️ " +
                (
                    data.message ||
                    "孩子，還沒到時候……請明天再回來。"
                );

            return;

        }


        /*
         * 已經開放，但教父尚未回覆
         */

        if (
            !data.replied
        ) {

            replyMessage.textContent =
                "🕯️ " +
                (
                    data.message ||
                    "教父還在準備你的回信，請稍後再回來。"
                );

            return;

        }


        /*
         * 已經收到回信
         */

        replyMessage.textContent =
            "✦ 教父已經回覆你了。";


        replyText.textContent =
            data.reply ||
            "";


        godfatherReply.style.display =
            "block";


    }

    catch (error) {

        replyMessage.textContent =
            "🕯️ " +
            error.message;

    }

}


/* =========================
   返回／再次調配
========================= */

if (replyBackBtn) {

    replyBackBtn.addEventListener(
        "click",
        () => {

            showScreen(
                screens.color
            );

        }
    );

}


restartBtn.addEventListener(
    "click",
    () => {

        selectedColors = [];

        currentFortune = null;

        currentPrayerCode = "";

        colorTubes.forEach(
            tube => {

                tube.classList.remove(
                    "selected"
                );

            }
        );


        prayerInput.value = "";

        charCount.textContent =
            "0";


        fortuneCard.classList.remove(
            "flipped"
        );


        updateSelection();


        showScreen(
            screens.color
        );

    }
);
/* =========================
   教父檔案室・隱藏彩蛋
========================= */

const archiveTrigger =
    document.getElementById("secretArchiveTrigger");

const archiveSecret =
    document.getElementById("archiveSecret");

const closeArchiveSecret =
    document.getElementById("closeArchiveSecret");

let archiveClickCount = 0;
let archiveClickTimer = null;


/* 連點 5 次 */

archiveTrigger.addEventListener("click", () => {

    archiveClickCount++;

    clearTimeout(archiveClickTimer);

    archiveClickTimer = setTimeout(() => {
        archiveClickCount = 0;
    }, 1500);


    if (archiveClickCount >= 5) {

        archiveClickCount = 0;

        archiveTrigger.classList.add("unlocked");

        archiveSecret.classList.add("show");

    }

});


/* 關閉 */

closeArchiveSecret.addEventListener("click", () => {

    archiveSecret.classList.remove("show");

});


/* 點黑幕也可以關閉 */

archiveSecret.addEventListener("click", (event) => {

    if (event.target === archiveSecret) {
        archiveSecret.classList.remove("show");
    }

});