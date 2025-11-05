var subjects = [
    { name: "Math", credit: 4 },
    { name: "DSA", credit: 4 },
    { name: "OS", credit: 4 },
    { name: "COA", credit: 4 },
    { name: "APP", credit: 4 },
    { name: "UHV", credit: 3 },
];
var calcBtn = document.getElementById("calcBtn");
var clearBtn = document.getElementById("clearBtn");
var consoleBox = document.getElementById("console");
function logLine(text) {
    consoleBox.innerText += text + "\n";
    consoleBox.scrollTop = consoleBox.scrollHeight;
}
calcBtn.addEventListener("click", function () {
    consoleBox.innerText = "";
    var totalPoints = 0;
    var totalCredits = 0;
    logLine("--------------- RESULT ---------------");
    subjects.forEach(function (subj, i) {
        var inputElement = document.getElementById(subj.name);
        var mark = parseFloat(inputElement.value || "0");
        if (isNaN(mark)) {
            logLine("".concat(subj.name, ": \u274C Invalid input"));
            subj.gradePoint = 0;
            return;
        }
        logLine("\nFor ".concat(subj.name, ":"));
        // APP and UHV direct grading (out of 100)
        if (i === 4 || i === 5) {
            var gradePoint = 0;
            if (mark >= 91)
                gradePoint = 10;
            else if (mark >= 81)
                gradePoint = 9;
            else if (mark >= 71)
                gradePoint = 8;
            else if (mark >= 61)
                gradePoint = 7;
            else if (mark >= 51)
                gradePoint = 6;
            else
                gradePoint = 0;
            logLine("Total Marks: ".concat(mark, " "));
            subj.gradePoint = gradePoint;
            totalPoints += gradePoint * subj.credit;
            totalCredits += subj.credit;
            return;
        }
        // For 40-mark internal + 75-mark endsem subjects
        var gradeLimits = [91, 81, 71, 61, 51];
        var gradeValues = [10, 9, 8, 7, 6];
        var gradeNames = ["O", "A+", "A", "B", "C"];
        var gotGrade = false;
        for (var g = 0; g < gradeLimits.length; g++) {
            var required = ((gradeLimits[g] - mark) / 40) * 75;
            if (required <= 75 && required >= 0) {
                logLine("To get ".concat(gradeNames[g], ": need ").concat(required.toFixed(2), " in Endsem"));
                subj.gradePoint = gradeValues[g];
                gotGrade = true;
                // If required marks are 70+ — warn + show next possible grade
                if (required > 69) {
                    logLine(" ".concat(required.toFixed(2), "/75? Tumhara khel khatam hai\uD83D\uDC94\uD83D\uDC94"));
                    for (var gg = g + 1; gg < gradeLimits.length; gg++) {
                        var easier = ((gradeLimits[gg] - mark) / 40) * 75;
                        if (easier <= 75 && easier >= 0) {
                            logLine("Maybe ".concat(gradeNames[gg], ": need ").concat(easier.toFixed(2), " in Endsem"));
                            subj.gradePoint = gradeValues[gg];
                            break;
                        }
                    }
                }
                break;
            }
        }
        if (!gotGrade) {
            logLine("Even with 75/75, Khel Khatam 💔");
            subj.gradePoint = 0;
        }
        totalPoints += subj.gradePoint * subj.credit;
        totalCredits += subj.credit;
    });
    var cgpa = totalPoints / totalCredits;
    logLine("\n-------------------------------------");
    logLine("Estimated CGPA: ".concat(cgpa.toFixed(2)));
    logLine("Call Karu Bacchha?\uD83E\uDD7A\uD83E\uDD7A\uD83E\uDD7A");
    logLine("-------------------------------------");
});
clearBtn.addEventListener("click", function () {
    consoleBox.innerText = "";
    var inputs = document.querySelectorAll("input");
    inputs.forEach(function (input) { return (input.value = ""); });
});
var bestBtn = document.getElementById("bestBtn");
if (bestBtn) {
    bestBtn.addEventListener("click", function () {
        consoleBox.innerText = "------------- BEST GPA POSSIBLE -------------\n";
        var totalPoints = 0;
        var totalCredits = 0;
        subjects.forEach(function (subj, i) {
            var _a;
            // For APP and UHV (out of 100)
            if (i === 4 || i === 5) {
                subj.gradePoint = 10; // max grade
                logLine("For ".concat(subj.name, ": scored 100/100 \u2192 Grade O (10)"));
            }
            else {
                // 40 internal + 75 endsem → assume 75/75 in endsem
                var input = document.getElementById(subj.name);
                var internal = parseFloat(input.value || "0");
                var total = internal + 75 * (40 / 75); // normalized total
                var gradePoint = 0;
                if (total >= 91)
                    gradePoint = 10;
                else if (total >= 81)
                    gradePoint = 9;
                else if (total >= 71)
                    gradePoint = 8;
                else if (total >= 61)
                    gradePoint = 7;
                else if (total >= 51)
                    gradePoint = 6;
                subj.gradePoint = gradePoint;
                logLine("For ".concat(subj.name, ": with perfect 75/75 \u2192 Grade ").concat(gradePoint === 10 ? "O" : gradePoint === 9 ? "A+" : gradePoint === 8 ? "A" : gradePoint === 7 ? "B" : gradePoint === 6 ? "C" : "F", " (").concat(gradePoint, ")"));
            }
            totalPoints += ((_a = subj.gradePoint) !== null && _a !== void 0 ? _a : 0) * subj.credit;
            totalCredits += subj.credit;
        });
        var bestCgpa = totalPoints / totalCredits;
        logLine("\n-------------------------------------");
        logLine("\uD83D\uDD25 Maximum Possible CGPA: ".concat(bestCgpa.toFixed(2), " \uD83D\uDD25"));
        logLine("-------------------------------------");
    });
}
