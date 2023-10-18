import { RouterModule, Routes } from '@angular/router';

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ColorPickerModule } from 'ngx-color-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

import { MatSliderModule } from '@angular/material/slider';
import { HomeComponent } from './home/home.component';
import { LocalStorageService } from './local-storage.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

import { sampleCanvasData as sampleData } from 'sample-data';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'whiteboard/:id', component: WhiteboardComponent },
];

@NgModule({
  declarations: [AppComponent, WhiteboardComponent, HomeComponent],
  imports: [
    BrowserModule,
    FormsModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatSliderModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
    MatIconModule,

    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    LocalStorageService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLocalStorage,
      deps: [LocalStorageService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
export function initializeLocalStorage(
  localStorageService: LocalStorageService
) {
  return () => {
    if (!localStorageService.get('sampleCanvasData')) {
      const sampleCanvasData = [
        { id: 0, name: 'Sample 1', json: sampleData[0] },
        { id: 1, name: 'Sample 2', json: sampleData[1] },
        { id: 2, name: 'Sample 3', json: sampleData[2] },
        { id: 3, name: 'Sample 4', json: sampleData[3] },
      ];

      localStorageService.save('sampleCanvasData', sampleCanvasData);
    }
  };
}
