$(document).ready(function(){
    $("#submit").click(function() {
        onButtonClick();
    });
});

function onButtonClick() {
    // Get the value of the input field
    const R1 = $('input[name="R1"]:checked').val();
    const R2 = $('input[name="R2"]:checked').val();
    const I1 = $('input[name="I1"]:checked').val(); 
    const I2 = $('input[name="I2"]:checked').val();
    const A1 = $('input[name="A1"]:checked').val();
    const A2 = $('input[name="A2"]:checked').val();
    const S1 = $('input[name="S1"]:checked').val();
    const S2 = $('input[name="S2"]:checked').val();
    const E1 = $('input[name="E1"]:checked').val();
    const E2 = $('input[name="E2"]:checked').val();
    const C1 = $('input[name="C1"]:checked').val();
    const C2 = $('input[name="C2"]:checked').val();

    // Convert the values to numbers
    const scoreResults = {
        Realistic: parseInt(R1) + parseInt(R2),
        Investigative: parseInt(I1) + parseInt(I2),
        Artistic: parseInt(A1) + parseInt(A2),
        Social: parseInt(S1) + parseInt(S2),
        Enterprising: parseInt(E1) + parseInt(E2),
        Conventional: parseInt(C1) + parseInt(C2)
    };
    
    // record the results
    const results = {
        Doctor: scoreResults.Investigative + scoreResults.Social,
        Dentist: scoreResults.Artistic + scoreResults.Enterprising,
        Pharmacist: scoreResults.Investigative + scoreResults.Conventional,
        Veterinarian: scoreResults.Investigative + scoreResults.Realistic,
        MedicalTech: scoreResults.Conventional + scoreResults.Realistic,
        Nurse: scoreResults.Conventional + scoreResults.Social,
    };

    // Find the highest and second highest values
    let highestCategory = null;
    let highestValue = -Infinity;

    let secondHighestCategory = null;
    let secondHighestValue = -Infinity;

    // Find the highest and second highest values
    for (const [category, value] of Object.entries(results)) {
        if (value > highestValue) {
            secondHighestValue = highestValue;
            secondHighestCategory = highestCategory;
            highestValue = value;
            highestCategory = category;
        } else if (value > secondHighestValue) {
            secondHighestValue = value;
            secondHighestCategory = category;
        }
    }

    // Display the results
    console.log(`The category with the highest value is ${highestCategory} with a score of ${highestValue}.`);
    console.log(`The category with the second highest value is ${secondHighestCategory} with a score of ${secondHighestValue}.`);

    // Store the objects as JSON strings
    localStorage.setItem("results", JSON.stringify(results));
    localStorage.setItem("scoreResults", JSON.stringify(scoreResults)); 

    // Redirect to the results page with the scores as query parameters
    window.location.href = `results.html`;
}
