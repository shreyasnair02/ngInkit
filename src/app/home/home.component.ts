import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  whiteboardId: string = '';
  whiteboards: string[] = [];
  openWhiteboard(id: string) {
    console.log(id);
    if (id === '') {
      const data: [] = this.localStorageService.get('sampleCanvasData');
      id = '' + (data.length + 1);
    }
    this.router.navigate(['/whiteboard', id]);
  }

  getDataFromLocalStorage(): void {
    const data = localStorage.getItem('sampleCanvasData'); 
    if (data) {
      this.whiteboards = JSON.parse(data);
    }
  }
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.getDataFromLocalStorage();
  }
}
