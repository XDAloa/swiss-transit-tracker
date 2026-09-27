import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app/app.component';
import { AppModule } from './app/app.module';

describe('AppComponent', () => {
    it('creates the application component', async () => {
        await TestBed.configureTestingModule({
            imports: [AppModule]
        }).compileComponents();

        const fixture = TestBed.createComponent(AppComponent);
        expect(fixture.componentInstance).toBeTruthy();
    });
});