var bladeNames = ["Godfrey", "Perceval", "Vale", "Agate", "Gorg", "Boreas", "Dagas", "Perun", "Kora", "Azami", "Ursala", "Newt", "Nim", "Adenine", "Electra", "Zenobia", "Finch", "Floren", "KOS-MOS", "Dahlia"];
var baseRates = [
        [0.63, 0.63, 1.25, 1.56, 2.19],
        [1.50, 0.25, 0.50, 1.00, 1.75],
        [0.75, 0.25, 0.25, 0.25, 0.25],
        [0.25, 0.38, 0.75, 0.75, 0.13],
        [1.00, 1.00, 0.50, 1.50, 1.00],
        [0.25, 2.13, 2.13, 0.56, 1.19],
        [0.50, 0.75, 0.50, 1.25, 0.50],
        [2.44, 0.25, 0.63, 1.88, 1.06],
        [0.63, 1.88, 1.88, 0.31, 1.56],
        [0.31, 1.88, 1.25, 0.63, 2.19],
        [2.25, 0.63, 1.25, 1.88, 0.25],
        [0.25, 0.25, 0.25, 0.25, 0.75],
        [1.00, 1.00, 1.75, 0.25, 1.00],
        [1.50, 0.25, 1.00, 1.75, 0.50],
        [1.88, 2.25, 0.63, 1.25, 0.25],
        [0.25, 0.75, 0.25, 0.25, 0.25],
        [0.50, 1.00, 1.75, 0.25, 1.50],
        [1.75, 1.50, 1.00, 0.50, 0.25],
        [0.10, 0.10, 0.10, 0.10, 0.10],
        [0.13, 0.50, 0.25, 0.88, 0.75],
        [0.25, 0.25, 0.25, 0.25, 0.25],
        [0.25, 0.25, 0.25, 0.25, 0.25],
        [0.50, 0.50, 0.50, 0.50, 0.50],
        [0.50, 0.50, 0.50, 0.50, 0.50],
        [0.50, 0.50, 0.50, 0.50, 0.50],
        [0.50, 0.50, 0.50, 0.50, 0.50],
        [0.50, 0.50, 0.50, 0.50, 0.50]
];
var baseAverage = [1.252, 1.0, 0.35, 0.45199999999999996, 1.0, 1.252, 0.7, 1.252, 1.252, 1.252, 1.252, 0.35, 1.0, 1.0, 1.252, 0.35, 1.0, 1.0, 0.1, 0.502, 0.25, 0.25, 0.50, 0.50, 0.50, 0.50, 0.50];
var bladeIdeas = [1, 3, 3, 2, 0, 1, 0, 1, 2, 3, 1, 0, 2, 1, 2, 1, 1, 2, 3, 1, 2, 2, 2, 0, 2, 1];
var luck = 0;
var ideas = [0, 0, 0, 0];
var ideaNames = ["Bravery", "Truth", "Compassion", "Justice"];
var useNGplus = false;
var ngplusBlades = ["Godfrey", "Perceval", "Vale", "Agate", "Gorg", "Boreas", "Dagas", "Perun", "Kora", "Azami", "Ursala", "Newt", "Nim", "Adenine", "Electra", "Zenobia", "Finch", "Floren", "KOS-MOS", "Dahlia", "Akhos", "Patroka", "Obrona", "Perdido", "Cressidus", "Sever"];

function clamp(inside, min, max) {
    if (max < min) {
        return clamp(inside, max, min);
    } else if (inside < min) {
        return min
    } else if(inside > max) {
        return max
    } else return inside
};

function main() {
    if (useNGplus) {
        usedBlades = ngplusBlades;
    } else {
        usedBlades = bladeNames;
    }
    var form = document.getElementById("calcForm");
    var bladesObtained = [];
    for (var i = 0; i < usedBlades.length; i++) {
        if (form["has" + usedBlades[i]].checked) {
            bladesObtained.push(true)
        } else bladesObtained.push(false);
    };
    var luckMod = Math.sqrt(Number(form["luck"].value)) * 0.01 * 1.3 + 0.95;
    if (luckMod < 1) luckMod = 1;
    var maxIdea = 0;
    for (var i = 0; i < ideas.length; i++) {
        ideas[i] = Number(form["idea" + ideaNames[i]].value);
        if (ideas[i] > maxIdea) maxIdea = ideas[i]
    };
    var ideaMod = [1.0, 1.0, 1.0, 1.0];
    var boosterIdea = Number(form["boosterType"].value) - 1,
      boosterCount = Number(form["boosterNum"].value);
    for (var i = 0; i < ideas.length; i++) {
        if (boosterIdea == i || (boosterIdea == -1 && ideas[i] == maxIdea)) ideaMod[i] = 1.0 + 0.05 * (ideas[i] + boosterCount);
    };
    var inversePoolOdds = [1, 1, 1];
    var returnString = "Your odds of finding each blade are: (Common, Rare, and Legendary Core Crystals respectively) <br>";
    for (var i = 0; i < usedBlades.length; i++) {
        if (!bladesObtained[i]) {
            var findRate = luckMod * ideaMod[bladeIdeas[i]];
            if (Number(form["column"].value) == 0) {
                findRate *= baseAverage[i];
            } else findRate *= baseRates[i][Number(form["column"].value)-1];
            var find_rate_common = clamp(Math.ceil(findRate * 1.00 * 0.01 * 101) / 101, 0.0, 1.0),
              find_rate_rare = clamp(Math.ceil(findRate * 1.50 * 0.01 * 101) / 101, 0.0, 1.0),
              find_rate_legendary = clamp(Math.ceil(findRate * 3.00 * 0.01 * 101) / 101, 0.0, 1.0);
            returnString += usedBlades[i] + ": " + String(find_rate_common * 25.0) + "%, " + String(find_rate_rare * 100.0) + "%, " + String(find_rate_legendary * 100.0) + "% <br>";
            inversePoolOdds[0] *= 1.00 - find_rate_common;
            inversePoolOdds[1] *= 1.00 - find_rate_rare;
            inversePoolOdds[2] *= 1.00 - find_rate_legendary;
        };
    };
    returnString += "Your odds of finding any Rare Blade at all are: <br>Common core: " + String(25.0 * (1.00 - inversePoolOdds[0])) + "% <br>Rare core: " + String(100.0 * (1.00 - inversePoolOdds[1])) + "% <br>Legendary core: " + String(100.0 * (1.00 - inversePoolOdds[2])) + "%";
    return returnString;
};

var form = document.createElement("form");
form.setAttribute("id", "calcForm");
var ngplus = document.createElement("input");
ngplus.type = "checkbox";
ngplus.name = "ngplus";
ngplus.id = "ngplus";
var label = document.createElement("label");
label.htmlFor = "ngplus";
label.appendChild(document.createTextNode("Are you in New Game+ ?"));
form.appendChild(ngplus);
form.appendChild(label);
form.appendChild(document.createElement("br"));
function toggle(className, displayState){
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++){
        elements[i].style.display = displayState;
    };
};
function loop() {
    if (document.getElementById("ngplus").checked) {
        if (!useNGplus) toggle("ngplus", "inline");
        useNGplus = true;
    } else {
        if (useNGplus) toggle("ngplus", "none");
        useNGplus = false;
    };
};
setInterval(loop, 1000);
for (var i = 0; i < bladeNames.length; i++) {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "has" + bladeNames[i];
    checkbox.id = "has" + bladeNames[i];
    var label = document.createElement("label");
    label.htmlFor = "has" + bladeNames[i];
    label.appendChild(document.createTextNode("Do you have " + bladeNames[i] + "?"));
    form.appendChild(checkbox);
    form.appendChild(label);
    form.appendChild(document.createElement("br"));
};
for (var i = 20; i < ngplusBlades.length; i++) {
    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "has" + ngplusBlades[i];
    checkbox.id = "has" + ngplusBlades[i];
    checkbox.className = "ngplus";
    checkbox.style.display = "none";
    var label = document.createElement("label");
    label.htmlFor = "has" + ngplusBlades[i];
    label.appendChild(document.createTextNode("Do you have " + ngplusBlades[i] + "?"));
    label.className = "ngplus";
    label.style.display = "none";
    var br = document.createElement("br");
    br.className = "ngplus";
    br.style.display = "none";
    form.insertBefore(checkbox, document.getElementById("column"));
    form.insertBefore(label, document.getElementById("column"));
    form.insertBefore(br, document.getElementById("column"));
};
var column = document.createElement("input");
column.type = "number";
column.name = "column";
column.setAttribute("id", "column");
column.min = "0";
column.max = "5";
var label = document.createElement("label");
label.htmlFor = "column";
label.appendChild(document.createTextNode("Enter your column here (put \"0\" if you don't know)."));
form.appendChild(column);
form.appendChild(label);
form.appendChild(document.createElement("br"));
var luckinput = document.createElement("input");
luckinput.type = "number";
luckinput.name = "luck";
luckinput.setAttribute("id", "luck");
luckinput.min = "0";
luckinput.max = "999";
var label = document.createElement("label");
label.htmlFor = "luck";
label.appendChild(document.createTextNode("Enter the driver's Luck stat here."));
form.appendChild(luckinput);
form.appendChild(label);
form.appendChild(document.createElement("br"));
for (var i = 0; i < ideas.length; i++) {
    var ideanum = document.createElement("input");
    ideanum.type = "number";
    ideanum.name = "idea" + ideaNames[i];
    ideanum.setAttribute("id", "idea" + ideaNames[i]);
    ideanum.min = "0";
    ideanum.max = "10";
    var label = document.createElement("label");
    label.htmlFor = "idea" + ideaNames[i];
    label.appendChild(document.createTextNode("Enter the driver's " + ideaNames[i] + " here."));
    form.appendChild(ideanum);
    form.appendChild(label);
    form.appendChild(document.createElement("br"));
};
var boosterType = document.createElement("input");
boosterType.type = "number";
boosterType.name = "boosterType";
boosterType.setAttribute("id", "boosterType");
boosterType.min = "0";
boosterType.max = "4";
var label = document.createElement("label");
label.htmlFor = "boosterType";
label.appendChild(document.createTextNode("Enter the type of booster here (0 for no booster, 1 for Bravery, 2 for Truth, 3 for Compassion, and 4 for Justice)."));
form.appendChild(boosterType);
form.appendChild(label);
form.appendChild(document.createElement("br"));
var boosterNum = document.createElement("input");
boosterNum.type = "number";
boosterNum.name = "boosterNum";
boosterNum.setAttribute("id", "boosterNum");
boosterNum.min = "0";
boosterNum.max = "5";
var label = document.createElement("label");
label.htmlFor = "boosterNum";
label.appendChild(document.createTextNode("Enter the number of boosters you are using here."));
form.appendChild(boosterNum);
form.appendChild(label);
var submit = document.createElement("input");
submit.setAttribute("type", "button");
submit.setAttribute("value", "Calculate");
submit.onclick = function() {
    var product = document.getElementById("calculator-product");
    while (product.firstChild) {
        product.removeChild(product.firstChild);
    };
    var text = main();
    var t = text.split("<br>"),
      i;
    for (i = 0; i < t.length; i++) {
        product.appendChild(document.createElement('br'));
        if (t[i].length > 0) {
            product.appendChild(document.createTextNode(t[i]));
        };
    };
};
form.appendChild(submit);
document.getElementById("calculator-slot").appendChild(form);
