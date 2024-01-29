/* eslint-disable no-unused-vars */
class ColoringApp {
    constructor(width, height, initialGridSize) {
        this.width = width;
        this.height = height;
        this.gridSize = initialGridSize;
        this.colors = ["none", "white", "red", "green", "blue"];
        this.currentColor = "none";
        this.createGrid();
        this.updateGridSizeInput();
    }
    createGrid() {
        const grid = document.getElementById("coloringGrid");
        grid.innerHTML = "";

        for (let row = 0; row < this.height; row++) {
            const rowElement = document.createElement("div");
            rowElement.classList.add("row");

            for (let col = 0; col < this.width; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.style.backgroundColor = "white";
                cell.addEventListener("click", () => this.handleCellClick(row, col));
                rowElement.appendChild(cell);
            }

            grid.appendChild(rowElement);
        }
    }

    handleCellClick(row, col) {
        const cell = this.getCellElement(row, col);
        const huidigeKleur = cell.style.backgroundColor;
  
        if (this.currentColor !== "none") {
            const kleurNaam = this.getKleurNaam(this.currentColor);
  
            if (huidigeKleur !== this.currentColor) {
                console.log(`Ik ben veld ${row}, ${col} en ik werd zopas ${kleurNaam} gekleurd.`);
                cell.style.backgroundColor = this.currentColor;
            } else {
                console.log(`Ik ben veld ${row}, ${col} en ik ben al ${kleurNaam}.`);
            }
        } else {
            const kleurNaam = this.getKleurNaam(huidigeKleur);
            console.log(`Ik ben veld ${row}, ${col} en ik ben ${kleurNaam}.`);
        }
    }
                
    getKleurNaam(kleurCode) {
        switch (kleurCode) {
        case "red":
            return "rood";
        case "green":
            return "groen";
        case "blue":
            return "blauw";
        case "white":
            return "wit";
        default:
            return kleurCode;
        }
    }

    updateGridSizeInput() {
        document.getElementById("gridWidth").value = this.width;
        document.getElementById("gridHeight").value = this.height;
        document.getElementById("gridSize").value = this.gridSize;
    }

    updateWidthHeightFromSize() {
        const gridSizeInput = document.getElementById("gridSize");
        const gridWidthInput = document.getElementById("gridWidth");
        const gridHeightInput = document.getElementById("gridHeight");

        const gridSizeValue = parseInt(gridSizeInput.value, 10);

        if (!isNaN(gridSizeValue)) {
            gridWidthInput.value = gridSizeValue;
            gridHeightInput.value = gridSizeValue;
        }
    }

    updateSizeFromWidthHeight() {
        const gridWidthInput = document.getElementById("gridWidth");
        const gridHeightInput = document.getElementById("gridHeight");
        const gridSizeInput = document.getElementById("gridSize");

        const widthValue = parseInt(gridWidthInput.value, 10);
        const heightValue = parseInt(gridHeightInput.value, 10);

        if (!isNaN(widthValue) && !isNaN(heightValue)) {
            const newSize = Math.max(widthValue, heightValue);
            gridSizeInput.value = newSize;
        }
    }

    getCellElement(row, col) {
        const index = row * this.width + col;
        return document.getElementsByClassName("cell")[index];
    }

    exportToJson() {
        const gridData = [];

        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                const cell = this.getCellElement(row, col);
                const color = cell.style.backgroundColor || "white";
                gridData.push({ row, col, color });
            }
        }

        console.log(JSON.stringify(gridData, null, 2));

        const blob = new Blob([JSON.stringify(gridData)], {
            type: "application/json",
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "coloringData.json";
        a.click();
    }

    importFromJson(jsonData) {
        const gridData = JSON.parse(jsonData);

        for (const data of gridData) {
            const cell = this.getCellElement(data.row, data.col);
            cell.style.backgroundColor = data.color;
        }
    }

    clearGrid() {
        this.currentColor = "white";
        this.createGrid();
    }
}

const initialWidth = 5;
const initialHeight = 5;
const initialGridSize = 5;

const coloringApp = new ColoringApp(initialWidth, initialHeight, initialGridSize);

function changeColor() {
    coloringApp.currentColor = document.getElementById("colorPicker").value;
}

function changeGridWidth() {
    coloringApp.width = parseInt(document.getElementById("gridWidth").value, 10);
    coloringApp.updateSizeFromWidthHeight();
}

function changeGridHeight() {
    coloringApp.height = parseInt(document.getElementById("gridHeight").value, 10);
    coloringApp.updateSizeFromWidthHeight();
}

function changeGridSize() {
    const newSize = parseInt(document.getElementById("gridSize").value, 10);
    coloringApp.width = newSize;
    coloringApp.height = newSize;
    coloringApp.clearGrid();
    coloringApp.updateWidthHeightFromSize();
}

function exportToJson() {
    coloringApp.exportToJson();
}

document.getElementById("importFile").addEventListener("change", function () {
    const fileInput = this;
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            coloringApp.importFromJson(e.target.result);
        };
        reader.readAsText(file);
    }
});
