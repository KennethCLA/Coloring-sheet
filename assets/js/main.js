class ColoringApp {
  constructor() {
    this.width = 5;
    this.height = 5;
    this.gridSize = 5;
    this.colors = ["none", "white", "red", "green", "blue"];
    this.currentColor = "none";
    this.gridState = new Array(this.width * this.height).fill("white");
    this.createGrid();
    this.updateGridSizeInput();
    this.stateHistory = [];
  }

  getCellColor(row, col) {
    if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
      const index = row * this.width + col;
      return this.gridState[index] || "white";
    } else {
      return "white";
    }
  }

  createGrid() {
    const grid = document.getElementById("coloringGrid");
    grid.innerHTML = "";

    const cellSize = Math.min(
      600 / this.width,
      600 / this.height,
      Math.floor(
        Math.min(window.innerWidth, window.innerHeight) /
          Math.max(this.width, this.height)
      )
    );

    for (let row = 0; row < this.height; row++) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");

      for (let col = 0; col < this.width; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.style.backgroundColor = this.getCellColor(row, col);
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.addEventListener("click", () => this.handleCellClick(row, col));
        rowElement.appendChild(cell);
      }

      grid.appendChild(rowElement);
    }
  }

  handleCellClick(row, col) {
    const cell = this.getCellElement(row, col);
    const currentColor = this.currentColor;
    const index = row * this.width + col;

    if (currentColor !== "none") {
      if (this.gridState[index] !== currentColor) {
        const kleurNaam = this.getKleurNaam(currentColor);
        console.log(
          `Ik ben veld ${row}, ${col} en ik werd zopas ${kleurNaam} gekleurd.`
        );
        cell.style.backgroundColor = currentColor;
        this.gridState[index] = currentColor; // opslaan van kleur
      } else {
        const kleurNaam = this.getKleurNaam(currentColor);
        console.log(
          `Ik ben veld ${row}, ${col} en ik ben al ${kleurNaam} gekleurd.`
        );
      }
    } else {
      const kleurNaam = this.getKleurNaam(this.gridState[index]);
      console.log(`Ik ben veld ${row}, ${col} en ik ben ${kleurNaam}.`);
    }
    this.stateHistory.push({
      row,
      col,
      color: this.currentColor,
    });
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

  updateGridColors() {
    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = this.gridState[i];
    }
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
    const fileName = prompt("Voer een bestandsnaam in:");
  
    if (!fileName) {
      return;
    }
  
    const gridData = [];
  
    for (let row = 0; row < coloringApp.height; row++) {
      for (let col = 0; col < coloringApp.width; col++) {
        const cell = coloringApp.getCellElement(row, col);
        const color = cell.style.backgroundColor || "white";
        gridData.push({ row, col, color });
      }
    }
  
    const jsonString = JSON.stringify(gridData, null, 2);
  
    const blob = new Blob([jsonString], {
      type: "application/json",
    });
  
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
  
    a.download = fileName + ".json";
  
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

const coloringApp = new ColoringApp();

function changeColor() {
  const colorPicker = document.getElementById("colorPicker");
  const selectedColor = colorPicker.value;

  coloringApp.currentColor = selectedColor;
}

function changeGridWidth() {
  coloringApp.stateHistory.push({
    gridState: JSON.parse(JSON.stringify(coloringApp.gridState)),
    color: coloringApp.currentColor,
  });

  coloringApp.width = parseInt(document.getElementById("gridWidth").value, 10);
  coloringApp.createGrid();

  const lastState = coloringApp.stateHistory.pop();
  coloringApp.currentColor = lastState.color;

  coloringApp.gridState = lastState.gridState;
  coloringApp.updateGridColors();
}

function changeGridHeight() {
  coloringApp.height = parseInt(
    document.getElementById("gridHeight").value,
    10
  );
  coloringApp.updateSizeFromWidthHeight();
  coloringApp.createGrid();
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

function toggleMenu() {
  const menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
    item.style.display = item.style.display === 'block' ? 'none' : 'block';
  });
}