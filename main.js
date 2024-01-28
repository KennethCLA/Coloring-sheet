class ColoringApp {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.colors = ['white', 'red', 'green', 'blue'];
      this.currentColor = this.colors[0]; // Start met wit
      this.createGrid();
    }
  
    createGrid() {
      const grid = document.getElementById('coloringGrid');
      grid.innerHTML = '';
  
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.addEventListener('click', () => this.handleCellClick(row, col));
          grid.appendChild(cell);
        }
        grid.appendChild(document.createElement('br'));
      }
    }
  
    handleCellClick(row, col) {
      const cell = this.getCellElement(row, col);
      console.log(`Ik ben veld ${row}, ${col} en ik ben ${this.currentColor}`);
  
      if (this.currentColor !== 'white') {
        console.log(`Ik ben veld ${row}, ${col} en ik werd zopas ${this.currentColor} gekleurd`);
        cell.style.backgroundColor = this.currentColor;
      } else {
        cell.style.backgroundColor = '';
      }
    }
  
    getCellElement(row, col) {
      const index = row * this.width + col;
      return document.getElementsByClassName('cell')[index];
    }
  
    exportToJson() {
      const gridData = [];
  
      for (let row = 0; row < this.height; row++) {
        for (let col = 0; col < this.width; col++) {
          const cell = this.getCellElement(row, col);
          const color = cell.style.backgroundColor || 'white';
          gridData.push({ row, col, color });
        }
      }
  
      console.log(JSON.stringify(gridData, null, 2));
  
      // Download JSON as a file
      const blob = new Blob([JSON.stringify(gridData)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'coloringData.json';
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
      this.currentColor = 'white';
      this.createGrid();
    }
  }
  
  const coloringApp = new ColoringApp(5, 5);
  
  function changeColor() {
    coloringApp.currentColor = document.getElementById('colorPicker').value;
  }
  
  function changeGridSize() {
    const newSize = parseInt(document.getElementById('gridSize').value, 10);
    coloringApp.width = newSize;
    coloringApp.height = newSize;
    coloringApp.clearGrid();
  }
  
  function exportToJson() {
    coloringApp.exportToJson();
  }
  
  document.getElementById('importFile').addEventListener('change', function () {
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
  