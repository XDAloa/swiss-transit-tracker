import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

describe('AppComponent', () => {
    it('creates the application component', async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [provideHttpClient()]
        }).compileComponents();

        const fixture = TestBed.createComponent(AppComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});