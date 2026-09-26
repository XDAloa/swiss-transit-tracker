import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    standalone: true,
    template: '<h1>Swiss Transit Tracker</h1>'
})
export class AppComponent { }

bootstrapApplication(AppComponent).catch((error: unknown) => console.error(error));