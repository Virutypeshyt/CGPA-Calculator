interface Subject {
  name: string;
  credit: number;
  gradePoint?: number;
}

const subjects: Subject[] = [
  { name: "Math", credit: 4 },
  { name: "DSA", credit: 4 },
  { name: "OS", credit: 4 },
  { name: "COA", credit: 4 },
  { name: "APP", credit: 4 },
  { name: "UHV", credit: 3 },
];

const calcBtn = document.getElementById("calcBtn") as HTMLButtonElement;
const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
const consoleBox = document.getElementById("console") as HTMLPreElement;

function logLine(text: string): void {
  consoleBox.innerText += text + "\n";
  consoleBox.scrollTop = consoleBox.scrollHeight;
}

calcBtn.addEventListener("click", () => {
  consoleBox.innerText = "";
  let totalPoints = 0;
  let totalCredits = 0;

  logLine("--------------- RESULT ---------------");

  subjects.forEach((subj, i) => {
    const inputElement = document.getElementById(subj.name) as HTMLInputElement;
    const mark = parseFloat(inputElement.value || "0");

    if (isNaN(mark)) {
      logLine(`${subj.name}: ❌ Invalid input`);
      subj.gradePoint = 0;
      return;
    }

    logLine(`\nFor ${subj.name}:`);

    // APP and UHV direct grading (out of 100)
    if (i === 4 || i === 5) {
      let gradePoint = 0;
      if (mark >= 91) gradePoint = 10;
      else if (mark >= 81) gradePoint = 9;
      else if (mark >= 71) gradePoint = 8;
      else if (mark >= 61) gradePoint = 7;
      else if (mark >= 51) gradePoint = 6;
      else gradePoint = 0;

      logLine(`Total Marks: ${mark} `);
      subj.gradePoint = gradePoint;
      totalPoints += gradePoint * subj.credit;
      totalCredits += subj.credit;
      return;
    }

    // For 40-mark internal + 75-mark endsem subjects
    const gradeLimits = [91, 81, 71, 61, 51];
    const gradeValues = [10, 9, 8, 7, 6];
    const gradeNames = ["O", "A+", "A", "B", "C"];
    let gotGrade = false;

    for (let g = 0; g < gradeLimits.length; g++) {
      const required = ((gradeLimits[g] - mark) / 40) * 75;

      if (required <= 75 && required >= 0) {
        logLine(`To get ${gradeNames[g]}: need ${required.toFixed(2)} in Endsem`);
        subj.gradePoint = gradeValues[g];
        gotGrade = true;

        // If required marks are 70+ — warn + show next possible grade
        if (required > 69) {
          logLine(` ${required.toFixed(2)}/75? Tumhara khel khatam hai💔💔`);
          for (let gg = g + 1; gg < gradeLimits.length; gg++) {
            const easier = ((gradeLimits[gg] - mark) / 40) * 75;
            if (easier <= 75 && easier >= 0) {
              logLine(`Maybe ${gradeNames[gg]}: need ${easier.toFixed(2)} in Endsem`);
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

  const cgpa = totalPoints / totalCredits;
  logLine("\n-------------------------------------");
  logLine(`Estimated CGPA: ${cgpa.toFixed(2)}`);
  logLine(`Call Karu Bacchha?🥺🥺🥺`);
  logLine("-------------------------------------");
});

clearBtn.addEventListener("click", () => {
  consoleBox.innerText = "";
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));
});


const bestBtn = document.getElementById("bestBtn") as HTMLButtonElement | null;

if (bestBtn) {
  bestBtn.addEventListener("click", () => {
    consoleBox.innerText = "------------- BEST GPA POSSIBLE -------------\n";

    let totalPoints = 0;
    let totalCredits = 0;

    subjects.forEach((subj, i) => {
      // For APP and UHV (out of 100)
      if (i === 4 || i === 5) {
        subj.gradePoint = 10; // max grade
        logLine(`For ${subj.name}: scored 100/100 → Grade O (10)`);
      } else {
        // 40 internal + 75 endsem → assume 75/75 in endsem
        const input = document.getElementById(subj.name) as HTMLInputElement;
        const internal = parseFloat(input.value || "0");
        const total = internal + 75 * (40 / 75); // normalized total

        let gradePoint = 0;
        if (total >= 91) gradePoint = 10;
        else if (total >= 81) gradePoint = 9;
        else if (total >= 71) gradePoint = 8;
        else if (total >= 61) gradePoint = 7;
        else if (total >= 51) gradePoint = 6;

        subj.gradePoint = gradePoint;
        logLine(`For ${subj.name}: with perfect 75/75 → Grade ${gradePoint === 10 ? "O" : gradePoint === 9 ? "A+" : gradePoint === 8 ? "A" : gradePoint === 7 ? "B" : gradePoint === 6 ? "C" : "F"} (${gradePoint})`);
      }

      totalPoints += (subj.gradePoint ?? 0) * subj.credit;
      totalCredits += subj.credit;
    });

    const bestCgpa = totalPoints / totalCredits;
    logLine("\n-------------------------------------");
    logLine(`🔥 Maximum Possible CGPA: ${bestCgpa.toFixed(2)} 🔥`);
    logLine("-------------------------------------");
  });
}
