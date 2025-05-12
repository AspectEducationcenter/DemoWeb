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
    let isValid = true;

    // Clear previous error messages
    $("#nameError, #schoolError, #GradeLvlError, #GradeError, #ExamExError, #TcasError, #regionError, #JobError, #UniversityError").text("");

    // Name
    const Name = $('input[name="name"]').val().trim();
    if (!Name) {
        $("#nameError").html("<div>⚠️ โปรดกรอกชื่อ</div>").addClass("text-red-500 text-[20px]");
        isValid = false;
    }

    // School
    const School = $('input[name="school"]').val().trim();
    if (!School) {
        $("#schoolError").html("<div>⚠️ โปรดกรอกชื่อโรงเรียน</div>").addClass("text-red-500 text-[20px]");
        isValid = false;
    }

    // Grade Level
    const GradeLvl = $('select[name="GradeLvl"]').val();
    if (!GradeLvl) {
        $("#GradeLvlError").html("<div>⚠️ โปรดเลือกระดับชั้น</div>").addClass("text-red-500 text-[20px]");
        isValid = false;
    }

    // Grade
    const Grade = $('input[name="Grade"]').val().trim();
    if (!Grade) {
        $("#GradeError").html("<div>⚠️ โปรดกรอกเกรดเฉลี่ย</div>").addClass("text-red-500 text-[20px]");
        isValid = false;
    }

    // Exam Scores
    const checkedExams = $('.exam-checkbox:checked');
    if (checkedExams.length === 0) {
        $("#ExamExError").html("<div>⚠️ โปรดเลือกอย่างน้อยหนึ่งข้อ</div>").addClass("text-red-500 text-[20px]");
        isValid = false;
    } else {
        // If "None" is not selected, check all score inputs are filled
        if (!$("#None").is(":checked")) {
            checkedExams.each(function () {
                const exam = $(this).attr("name");
                const score = $(`input[name="score-${exam}"]`).val();
                if (!score) {
                    $(`#input-container-${exam}`).append(`<span class="text-red-500 text-[20px] ml-2">⚠️ โปรดกรอกคะแนน</span>`);
                    isValid = false;
                }
            });
        }
    }

    // TCAS rounds
    const Tcas = [];
    $('input[name^="Tcas"]:checked').each(function () {
        Tcas.push($(this).attr("name").replace("Tcas", ""));
    });
    if (Tcas.length === 0) {
        $("#TcasError").html("<div>⚠️ โปรดเลือกรอบที่สนใจ</div>").addClass("text-red-500 text-[20px]");
        isValid = false;
    }

    // Region required only if TCAS2 is selected
    const Region = $('select[name="region"]').val();
    if ($("#tcas2").is(":checked") && !Region) {
        $("#regionError").html("<div>⚠️ โปรดเลือกภาค</div>").addClass("text-red-500 text-[20px]");
        isValid = false;
    }

    // Jobs
    const Jobs = [];
    $('input[name="Doctor"]:checked').each(() => Jobs.push("Doctor"));
    $('input[name="Dentist"]:checked').each(() => Jobs.push("Dentist"));
    $('input[name="Pharma"]:checked').each(() => Jobs.push("Pharmacist"));
    $('input[name="Vet"]:checked').each(() => Jobs.push("Vet"));
    $('input[name="Nurse"]:checked').each(() => Jobs.push("Nurse"));
    $('input[name="Tech"]:checked').each(() => Jobs.push("MedTech"));
    if (Jobs.length === 0) {
        $("#JobError").html("<div>⚠️ โปรดเลือกอาชีพ</div>").addClass("text-red-500 text-[20px]");
        isValid = false;
    }

    // University
    const UniversitySet = new Set();
    $('input[name="Gov"]:checked').each(() => UniversitySet.add("gov"));
    $('input[name="Private"]:checked').each(() => UniversitySet.add("pri"));
    $('input[name="Inter"]:checked').each(() => UniversitySet.add("inter"));
    const University = Array.from(UniversitySet);
    if (University.length === 0) {
        $("#UniversityError").html("<div>⚠️ โปรดเลือกประเภทมหาวิทยาลัย</div>").addClass("text-red-500 text-[20px]");
        isValid = false;
    }

    // If any field is invalid, do not continue
    if (!isValid) return;

    const formData = {
        Name,
        School,
        GradeLvl,
        Grade,
        Region,
        ExamEx: checkedExams.map((_, el) => $(el).next("label").text().trim()).get(),
        Tcas,
        Jobs,
        University
    };

    localStorage.setItem("formData", JSON.stringify(formData));
    console.log(formData);

    window.location.href = "Questionair.html";
}