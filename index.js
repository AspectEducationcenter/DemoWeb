$(document).ready(function(){
    document.getElementById("tcas2").addEventListener("change", function () {
    const regionContainer = document.getElementById("regionContainer");

    if (this.checked) {
        regionContainer.innerHTML = `
            <label class="text-[30px] font-semibold" for="region">ภาค</label><br>
            <span id="regionError"></span>
            <select class="text-[20px]" id="region" name="region">
              <option class="text-[20px]" value="">-- โปรดเลือก --</option>
              <option class="text-[20px]" value="1">ภาคเหนือ</option>
              <option class="text-[20px]" value="2">ภาคใต้</option>
              <option class="text-[20px]" value="3">ภาคกลาง</option>
              <option class="text-[20px]" value="4">ภาคตะวันออก</option>
              <option class="text-[20px]" value="5">ภาคตะวันตก</option>
              <option class="text-[20px]" value="6">ภาคตะวันออกเฉียงเหนือ</option>
            </select><br><br>
        `;
    } else {
        regionContainer.innerHTML = ""; // Remove dropdown if unchecked
    }
});
    $("#next").click(function() {
        onButtonClick();
    });
    
});

function onButtonClick() {
    // Get the value of the input field
    const Name = $('input[name="name"]').val();
    const School = $('input[name="school"]').val();
    const GradeLvl = $('select[name="GradeLvl"]').val();
    const Grade = $('input[name="Grade"]').val();
    const Region = $('select[name="region"]:checked').val();

    const ExamEx = [];
    $('.exam-checkbox:checked').each(function () {
        const label = $(this).next("label").text().trim(); // Gets the label text
        ExamEx.push(label);
    });

    const Tcas = [];
    $('input[name="Tcas1"]:checked').each(() => Tcas.push("1"));
    $('input[name="Tcas2"]:checked').each(() => Tcas.push("2"));
    $('input[name="Tcas3"]:checked').each(() => Tcas.push("3"));
    $('input[name="Tcas4"]:checked').each(() => Tcas.push("4"));


    const Jobs = [];
    $('input[name="Doctor"]:checked').each(() => Jobs.push("Doctor"));
    $('input[name="Dentist"]:checked').each(() => Jobs.push("Dentist"));
    $('input[name="Pharma"]:checked').each(() => Jobs.push("Pharmacist"));
    $('input[name="Vet"]:checked').each(() => Jobs.push("Vet"));
    $('input[name="Nurse"]:checked').each(() => Jobs.push("Nurse"));
    $('input[name="Tech"]:checked').each(() => Jobs.push("MedTech"));

    const UniversitySet = new Set();

    $('input[name="Gov"]:checked').each(() => UniversitySet.add("gov"));
    $('input[name="Private"]:checked').each(() => UniversitySet.add("pri"));
    $('input[name="Inter"]:checked').each(() => UniversitySet.add("inter"));
    
    const University = Array.from(UniversitySet);


    const formData = {
        Name,
        School,
        GradeLvl,
        Grade,
        Region,
        ExamEx,
        Tcas,
        Jobs,
        University
    };

    

    // record the results
    localStorage.setItem("formData", JSON.stringify(formData));
    console.log(formData);

    window.location.href = "Questionair.html";
}