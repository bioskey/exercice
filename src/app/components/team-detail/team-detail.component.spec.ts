import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TeamDetailComponent } from './team-detail.component';
import { TeamService } from '../../services/team.service';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

describe('TeamDetailComponent', () => {
  let component: TeamDetailComponent;
  let fixture: ComponentFixture<TeamDetailComponent>;
  let teamServiceSpy: jasmine.SpyObj<TeamService>;
  let router: Router;

  beforeEach(() => {
    teamServiceSpy = jasmine.createSpyObj('TeamService',
      ['getTeamDetail']);

    teamServiceSpy.getTeamDetail.and.returnValue(of());

    TestBed.configureTestingModule({
      imports: [
        TeamDetailComponent,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: TeamService, useValue: teamServiceSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({ name: 'Arsenal' }) } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TeamDetailComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('back method', () => {
    it('should navigate to home page', () => {
      // Given
      const navigateSpy = spyOn(router, 'navigate');

      // When
      component.back();

      // Then
      expect(navigateSpy).toHaveBeenCalledWith(['home']);
    });
  });

  describe('getTeam method', () => {
    it('should call service method getTeamDetail with route params', () => {
      // When
      component.getTeam();

      // Then
      expect(teamServiceSpy.getTeamDetail).toHaveBeenCalledWith('Arsenal');
    });
  });
});
