$(document).ready(function(){
    // Get data from localStorage
    const resultsJSON = localStorage.getItem("results");
    const scoreResultsJSON = localStorage.getItem("scoreResults");

    if (!resultsJSON || !scoreResultsJSON) {
        document.getElementById("resultsDisplay").innerText = "No results found. Please take the questionnaire first.";
        return;
    }

    // Parse the data
    const results = JSON.parse(resultsJSON);
    const scoreResults = JSON.parse(scoreResultsJSON);

    const { highestCategory, secondHighestCategory } = getResults(results);

    // Display the results
    // document.getElementById("R").innerHTML = 'Realistic: ' + scoreResults.Realistic;
    // document.getElementById("I").innerHTML = 'Investigative: ' + scoreResults.Investigative;
    // document.getElementById("A").innerHTML = 'Artistic: ' + scoreResults.Artistic;
    // document.getElementById("S").innerHTML = 'Social: ' + scoreResults.Social;
    // document.getElementById("E").innerHTML = 'Enterprising: ' + scoreResults.Enterprising;
    // document.getElementById("C").innerHTML = 'Conventional: ' + scoreResults.Conventional;

    document.getElementById("highestResult").innerHTML = `${highestCategory.join(', ')}`
    document.getElementById("secondResult").innerHTML = `${secondHighestCategory.join(', ')}`
    
    showScoreGraph(scoreResults);

    findHighestRecommendations(highestCategory);
    findSecondHighestRecommendations(secondHighestCategory);
});

function getResults(results) {
    let highestValue = -Infinity;
    let secondHighestValue = -Infinity;

    // Step 1: Find the highest and second-highest values
    for (const value of Object.values(results)) {
        if (value > highestValue) {
            secondHighestValue = highestValue;
            highestValue = value;
        } else if (value > secondHighestValue && value < highestValue) {
            secondHighestValue = value;
        }
    }

    // Step 2: Collect all careers matching those scores
    const highestCategories = [];
    const secondHighestCategories = [];

    for (const [category, value] of Object.entries(results)) {
        if (value === highestValue) {
            highestCategories.push(category);
        } else if (value === secondHighestValue) {
            secondHighestCategories.push(category);
        }
    }

    // Step 3: Translate to Thai
    const translations = {
        Doctor: "แพทย์ (Medical Doctor)",
        Dentist: "ทันตแพทย์ (Dentist)",
        Pharmacist: "เภสัชกร (Pharmacist)",
        Veterinarian: "สัตวแพทย์ (Veterinarian)",
        MedicalTech: "เทคนิคการแพทย์ (Medical Technologist)",
        Nurse: "พยาบาล (Nurse)"
    };

    const translatedHighest = highestCategories.map(c => translations[c] || c);
    const translatedSecond = secondHighestCategories.map(c => translations[c] || c);

    return {
        highestCategory: translatedHighest,
        secondHighestCategory: translatedSecond
    };
}
    

function showScoreGraph(scoreResults) {
    const ctx = document.getElementById("scoreChart").getContext("2d");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
            datasets: [{
                label: 'Holland Code Scores',
                data: [
                    scoreResults.Realistic,
                    scoreResults.Investigative,
                    scoreResults.Artistic,
                    scoreResults.Social,
                    scoreResults.Enterprising,
                    scoreResults.Conventional
                ],
                backgroundColor: [
                    '#f87171', '#60a5fa', '#facc15', '#34d399', '#fbbf24', '#a78bfa'
                ],
                borderColor: '#000',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Function to fetch sheet data and return a promise
function fetchSheetData(category) {
    return new Promise((resolve, reject) => {
        // Map of keywords to their corresponding Google Sheets CSV URLs
        const categoryURLs = {
            Doctor: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6wfmYobj9blH9XI-2PdJCn8_lNj80yA610w5meTDX1JYNEWAEAwrM5qzXiNTVBql-WdV649mN-Fws/pub?gid=0&single=true&output=csv",
            Dentist: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6wfmYobj9blH9XI-2PdJCn8_lNj80yA610w5meTDX1JYNEWAEAwrM5qzXiNTVBql-WdV649mN-Fws/pub?gid=1827277630&single=true&output=csv",
            Pharmacist: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6wfmYobj9blH9XI-2PdJCn8_lNj80yA610w5meTDX1JYNEWAEAwrM5qzXiNTVBql-WdV649mN-Fws/pub?gid=2075676562&single=true&output=csv",
            Veterinarian: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6wfmYobj9blH9XI-2PdJCn8_lNj80yA610w5meTDX1JYNEWAEAwrM5qzXiNTVBql-WdV649mN-Fws/pub?gid=1173127069&single=true&output=csv",
            Medical: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6wfmYobj9blH9XI-2PdJCn8_lNj80yA610w5meTDX1JYNEWAEAwrM5qzXiNTVBql-WdV649mN-Fws/pub?gid=1181775773&single=true&output=csv",
            Nurse: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6wfmYobj9blH9XI-2PdJCn8_lNj80yA610w5meTDX1JYNEWAEAwrM5qzXiNTVBql-WdV649mN-Fws/pub?gid=1855192975&single=true&output=csv"
        };

        // Loop through the map to find the right match
        for (const [key, url] of Object.entries(categoryURLs)) {
            if (category.includes(key)) {
                fetch(url)
                    .then(response => response.text())
                    .then(text => {
                        const parsed = Papa.parse(text, { skipEmptyLines: true });
                        resolve(parsed.data);  // Array of rows
                    })
                    .catch(error => {
                        reject("Fetch error: " + error);
                    });
                return;  // Exit the loop once the matching category is found
            }
        }

        reject("Category not found");  // If no category is found
    });
}

function findHighestRecommendations(highestCategory) {
    // Fetch User data from localStorage
    const userDataJSON = localStorage.getItem("formData");
    if (!userDataJSON) {
        console.error("No user data found in localStorage.");
        return;
    }
    const userData = JSON.parse(userDataJSON);
    console.log(userData);

    const title = document.getElementById("MajorTitle");
    title.innerHTML = ""; // Clear previous content

    highestCategory.forEach((category, index) => {
        const filteredData = [];

        // Create title and container for each category
        const categoryTitle = document.createElement("h1");
        categoryTitle.className = "text-3xl font-bold text-blue-600 mx-2 mb-2";
        categoryTitle.innerText = category;
        title.appendChild(categoryTitle);

        const container = document.createElement("div");
        container.id = `possibleMajor-${index}`;
        container.className = "overflow-y-auto max-h-[400px] mb-6"; // Tailwind scroll setup
        title.appendChild(container);

        fetchSheetData(category)
            .then(data => {
                const tcasRounds = userData.Tcas;
                const userGrade = userData.Grade;

                for (let i = 0; i < data.length; i++) {
                    const row = data[i];
                    const tcasRound = row[5];
                    
                    let acceptGrade = null;
                    if (row[6]) {
                        acceptGrade = parseFloat(row[6].replace(/[^0-9.]/g, ''));
                    }

                    if (
                        tcasRound &&
                        tcasRounds.some(round => tcasRound.includes(round)) &&
                        userGrade >= acceptGrade
                    ) {
                        filteredData.push(row);
                    }
                }

                console.log(`Filtered Data for ${category}:`, filteredData);

                if (filteredData.length === 0) {
                    container.innerHTML = "<p class='text-[20px] text-red-500 mx-20'>No recommendations available for this Major.</p>";
                    return;
                }

                filteredData.forEach(row => {
                    const rowDiv = document.createElement("div");
                    rowDiv.className = "m-2 mx-5 p-5 px-10 text-[20px] bg-gray-200 rounded-lg shadow-md flex flex-row hover:bg-gray-300 cursor-pointer";

                    const columns = [row[2], row[4], row[5], row[6]];
                    columns.forEach(cellData => {
                        const cellDiv = document.createElement("div");
                        cellDiv.className = "flex-grow text-left";
                        cellDiv.innerText = cellData;
                        rowDiv.appendChild(cellDiv);
                    });
                
                    // Attach click event directly to this row
                    rowDiv.addEventListener("click", () => {
                        showModal(row);
                    });
                
                    container.appendChild(rowDiv);
                });

            })
            .catch(error => {
                console.error(`Error fetching data for ${category}:`, error);
            });
    });
}

// Show modal with the detailed university information
function showModal(row) {
    const modal = document.getElementById("universityModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDetails = document.getElementById("modalDetails");

    // Assuming the row contains details like university name, major, grade requirement, etc.
    modalTitle.innerText = `มหาวิทยาลัย: ${row[2]}`; // Adjust based on your row data
    modalDetails.innerHTML = `
        <strong>คณะ:</strong> ${row[1]}<br>
        <strong>ชื่อหลักสูตรแบบเต็ม:</strong> ${row[3]}<br>
        <strong>รูปแบบของหลักสูตร:</strong> ${row[4]}<br>
        <strong>รอบ TCAS:</strong> ${row[5]}<br>
        <strong>เกรดขั้นต่ำ:</strong> ${row[6] !== "" ? row[6] : "ไม่ระบุ"}<br>
        <strong>เหตุผลที่แนะนำมหาลัยนี้:</strong> ${row[10]}<br>
        <strong>Insight Qoute:</strong> ${row[11]}<br>
        <strong>Tag ความเหมาะสม:</strong> ${row[12]}<br>
    `;

    modal.classList.remove("hidden"); // Show the modal
}

// Close the modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("universityModal").classList.add("hidden");
});




function findSecondHighestRecommendations(secondHighestCategory) {
    const userDataJSON = localStorage.getItem("formData");
    if (!userDataJSON) {
        console.error("No user data found in localStorage.");
        return;
    }
    const userData = JSON.parse(userDataJSON);
    console.log(userData);

    const title = document.getElementById("MajorTitle2");
    title.innerHTML = "";

    secondHighestCategory.forEach((category, index) => {
        const filteredData = [];

        const categoryTitle = document.createElement("h1");
        categoryTitle.className = "text-3xl font-bold text-green-600 mx-2 mb-2";
        categoryTitle.innerText = category;
        title.appendChild(categoryTitle);

        const container = document.createElement("div");
        container.id = `possibleMajor2-${index}`;
        container.className = "overflow-y-auto max-h-[400px] mb-6";
        title.appendChild(container);

        fetchSheetData(category)
            .then(data => {
                const tcasRounds = userData.Tcas;
                const userGrade = userData.Grade;

                for (let i = 0; i < data.length; i++) {
                    const row = data[i];
                    const tcasRound = row[5];

                    let acceptGrade = null;
                    if (row[6]) {
                        acceptGrade = parseFloat(row[6].replace(/[^0-9.]/g, ''));
                    }

                    if (
                        tcasRound &&
                        tcasRounds.some(round => tcasRound.includes(round)) &&
                        userGrade >= acceptGrade
                    ) {
                        filteredData.push(row);
                    }
                }

                console.log(`Filtered Data for ${category}:`, filteredData);

                if (filteredData.length === 0) {
                    container.innerHTML = "<p class='text-[20px] text-red-500 mx-20'>No recommendations available for this Major.</p>";
                    return;
                }

                filteredData.forEach(row => {
                    const rowDiv = document.createElement("div");
                    rowDiv.className = "m-2 mx-5 p-5 px-10 text-[20px] bg-gray-200 rounded-lg shadow-md flex flex-row hover:bg-gray-300 cursor-pointer";

                    const columns = [row[2], row[4], row[5], row[6]];
                    columns.forEach(cellData => {
                        const cellDiv = document.createElement("div");
                        cellDiv.className = "flex-grow text-left";
                        cellDiv.innerText = cellData;
                        rowDiv.appendChild(cellDiv);
                    });

                    rowDiv.addEventListener("click", () => {
                        showModal(row);
                    });

                    container.appendChild(rowDiv);
                });
            })
            .catch(error => {
                console.error(`Error fetching data for ${category}:`, error);
            });
    });
}



