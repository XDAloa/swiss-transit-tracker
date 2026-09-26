import { TestBed } from '@angular/core/testing';
import { AppComponent } from './main';

describe('AppComponent', () => {
    it('creates the application component', async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent]
        }).compileComponents();

        const fixture = TestBed.createComponent(AppComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});