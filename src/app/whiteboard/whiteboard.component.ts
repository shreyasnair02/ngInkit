import { LocalStorageService } from '../local-storage.service'; // Import your LocalStorageService or use your preferred method to access localStorage
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { Component, ElementRef, OnInit, Type, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { sampleCanvasData } from 'sample-data';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-whiteboard',
  templateUrl: './whiteboard.component.html',
  styleUrls: ['./whiteboard.component.scss'],
})
export class WhiteboardComponent implements OnInit {
  @ViewChild('whiteboardCanvas', { static: true }) canvas!: ElementRef;

  private canvasObject!: fabric.Canvas;
  whiteboardId = '';
  selectedTool: 'brush' | 'rectangle' | 'circle' | 'select' = 'select';
  selectedColor: string = '#000000';
  brushSize: number = 5;
  selectMode() {
    this.selectedTool = 'select';
    this.canvasObject.isDrawingMode = false;
    this.canvasObject.selection = true;
  }
  constructor(
    private route: ActivatedRoute, // Inject ActivatedRoute
    private localStorageService: LocalStorageService, // Inject your LocalStorageService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}
  ngOnInit() {
    this.canvasObject = new fabric.Canvas(this.canvas.nativeElement, {
      defaultCursor: 'default',
      selection: true,
      selectionBorderColor: 'blue',
      selectionLineWidth: 2,
    });
    fabric.Object.prototype.cornerColor = 'blue';
    fabric.Object.prototype.cornerStyle = 'circle';
    this.selectMode();
    this.canvasObject.on('mouse:up', (options) => {
      if (this.selectedTool === 'rectangle') {
        this.createRectangle(options.e);
        this.selectMode();
      } else if (this.selectedTool === 'circle') {
        this.createCircle(options.e);
        this.selectMode();
      }
    });
    this.route.params.subscribe((params) => {
      this.whiteboardId = params['id'];

      // Use your localStorage service or preferred method to get the JSON data
      const whiteboardData = this.localStorageService.get('sampleCanvasData');
      if (whiteboardData) {
        const canvasJSON = whiteboardData.find((canvas: any) => {
          console.log(canvas.id, this.whiteboardId);
          return canvas.id == this.whiteboardId;
        });
        if (canvasJSON) {
          this.canvasObject.loadFromJSON(canvasJSON.json, () => {
            console.log(canvasJSON);
          });
        }
      }
    });
  }

  selectBrush() {
    this.canvasObject.isDrawingMode = true;
    this.canvasObject.selection = false;
  }

  selectTool(tool: 'brush' | 'rectangle' | 'circle' | 'select' = 'select') {
    this.selectedTool = tool;
    if (tool === 'brush') {
      this.selectBrush();
    } else {
      this.canvasObject.selection = false;
      this.canvasObject.isDrawingMode = false;
    }
    console.log(this.selectedTool);
    console.log(this.canvasObject.selection);
  }
  createRectangle(event: MouseEvent) {
    const rect = new fabric.Rect({
      left: event.offsetX - 25,
      top: event.offsetY - 25,
      width: 50,
      height: 50,
      fill: 'transparent',
      stroke: 'black',
    });
    this.canvasObject.add(rect);
  }

  createCircle(event: MouseEvent) {
    const circle = new fabric.Circle({
      left: event.offsetX - 25,
      top: event.offsetY - 25,
      radius: 25,
      fill: 'transparent',
      stroke: 'black',
    });
    this.canvasObject.add(circle);
  }

  updateBrushSize() {
    this.canvasObject.freeDrawingBrush.width = this.brushSize;
  }

  updateBrushColor(event: string) {
    console.log(event);
    this.canvasObject.freeDrawingBrush.color = this.selectedColor = event;
  }

  clearCanvas() {
    this.canvasObject.clear();
  }
  saveAsJSON() {
    const canvasJSON = this.canvasObject.toJSON();
    const data = this.localStorageService.get('sampleCanvasData');
    this.localStorageService.remove('sampleCanvasData');
    const index = parseInt(this.whiteboardId);
    if (data[index]) {
      data[index] = {
        id: index,
        name: data[index].name,
        json: canvasJSON,
      };
    } else {
      data.push({
        id: index,
        name: 'Sample ' + index,
        json: canvasJSON,
      });
    }
    this.localStorageService.save('sampleCanvasData', data);
    console.log(canvasJSON);
    this.openSnackBar('🔥Saved Successfully');
  }

  // Function to save the canvas as SVG
  saveAsSVG() {
    const svg = this.canvasObject.toSVG();

    // Create a Blob from the SVG content
    const blob = new Blob([svg], { type: 'image/svg+xml' });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'canvas.svg'; // Set the desired file name
    a.style.display = 'none';

    // Append the link to the DOM and trigger a click event to download
    document.body.appendChild(a);
    a.click();

    // Remove the link from the DOM
    document.body.removeChild(a);

    // Clean up the URL object
    URL.revokeObjectURL(url);
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', { duration: 2000 });
  }
  goBack() {
    this.router.navigate(['/']);
  }
}
